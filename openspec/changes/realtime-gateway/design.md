## Context

The backend has no WebSocket server. Two in-flight changes need one: `community` (chat) and `lms-video-conferencing` (mediasoup signaling). Redis exists but is used only by Bull queues. The exploration surfaced that chat and video have *opposite* realtime semantics:

- **Chat** persists messages in PG (source of truth) and only needs low-latency **broadcast fan-out** so every viewer of a conversation sees new messages live, regardless of which instance they connect to.
- **Video (mediasoup)** carries only *signaling* over WS; the actual media (RTP) is handled by mediasoup workers bound to one process. A room's state lives on a single instance, so signaling needs **instance-affinity routing**, not broadcast.

Therefore a "shared gateway" means: one WS transport + shared auth + a connection registry + a `RealtimeBus` abstraction, with **two routing strategies** plugged in. The `community` change already declared `RealtimePublisher` and `INotificationEventEmitter` ports that this gateway implements/backs.

Redis pub/sub is **best-effort** (fire-and-forget, no replay). This is acceptable because PG is the reliable source; clients reconcile via `GET /api/conversations/:id/messages` on (re)connect. WS = liveness, REST = correctness.

## Goals / Non-Goals

**Goals:**
- One authenticated WebSocket server on the existing HTTP process.
- `RealtimeBus` port with `LocalEventBus` (dev) and `RedisPubSubBus` (prod) — modules depend on the port, never on `ws`/Redis directly.
- Chat **broadcast fan-out** via per-conversation pub/sub channels.
- Video **instance-affine** signaling routing to the room-owning instance.
- Reusable backbone for domain events (Thread D).

**Non-Goals (this change):**
- Implementing chat or video *business logic* — those live in `community` / `lms-video-conferencing`. This change provides transport + bus only.
- Cross-instance **presence** beyond per-instance registry (global online-state is a future concern).
- Guaranteed delivery / message replay over pub/sub (PG + REST reconcile instead).
- Deciding the final library (Open Decision 1) — recommended `ws`, alternative Socket.IO noted.

## Decisions

### D1 — Single shared gateway, module handlers register (not own)
`src/realtime/` is a **platform/shared-kernel** module. It owns the WS server, auth-on-upgrade, `ConnectionRegistry`, and `RealtimeBus`. Feature modules register a handler (chat, video). This keeps one transport, one auth path, and a clean Modulith boundary.

### D2 — `RealtimeBus` port (publish/subscribe)
```
   interface RealtimeBus {
     publish(channel: string, payload: unknown): void
     subscribe(channel: string, handler: (payload: unknown) => void): void
     unsubscribe(channel: string): void
   }
```
- `LocalEventBus` — in-memory `Map<channel, Set<handler>>`. Dev + **unit tests** (no Redis).
- `RedisPubSubBus` — ioredis `publish`/`subscribe`, reusing the existing Redis. Staging/prod.

### D3 — Chat = broadcast fan-out
Chat handler subscribes to `chat:<conversationId>` for every conversation a *local* socket is viewing (ref-counted per node). On `SendMessage`, the community use case persists to PG, then `bus.publish("chat:<id>", msg)`. Every node receives and writes to its local sockets in that conversation. No global broadcast.

### D4 — Video = instance-affine routing
mediasoup room state is single-instance. Two strategies (Open Decision 3):
- **(X) sticky LB** by `roomId` hash → all peers of a room land on the owning instance. Simple, needs LB config.
- **(Y) Redis room-registry** → `RoomManager` advertises `owns room:<id> → instanceId`; signaling messages are routed via the bus to that instance. No LB change, more code.
Recommended: **X** for MVP.

### D5 — Bus doubles as domain-event backbone (Thread D)
The same `RedisPubSubBus` carries `events.message.sent`, `events.project.created`, etc. Client fan-out channels (`chat:<id>`) and domain-event channels (`events.*`) coexist on one Redis pub/sub backbone. `INotificationEventEmitter` (declared in `community`) publishes to `events.*`; `add-notification-system` subscribes.

### D6 — Auth on upgrade, shared
WS `upgrade` requests carry the same session cookie / JWT as REST. The gateway validates it once and attaches `user_id` to the socket; handlers receive an authenticated context. No per-module auth duplication.

### D7 — Clean Architecture: no core leakage
Handlers and the bus are infrastructure. Feature *use cases* call the `RealtimePublisher`/`RealtimeBus` **port** and never import `ws`/ioredis/Winston. Winston logging is at the gateway perimeter (connections, publish/subscribe counts), not inside modules.

## Architecture

```
                  Load Balancer (sticky by roomId for video — D4-X)
                         │
      ┌──────────────────┴───────────────────────┐
      │            HTTP server (:3001)            │
      │  ├─ Express REST (/api/...)               │
      │  └─ WS upgrade ─▶ RealtimeGateway         │
      │       ├─ authMiddleware (cookie/JWT)  [D6]│
      │       ├─ ConnectionRegistry (per-instance)│
      │       ├─ RealtimeBus (PORT)           [D2]│
      │       │    ├─ LocalEventBus (dev/test)    │
      │       │    └─ RedisPubSubBus (prod)       │
      │       ├─ chat handler  → subs "chat:<c>"  │  broadcast  [D3]
      │       └─ video handler → routes to RoomMgr│  affine    [D4]
      └───────────────────────────────────────────┘
                   │ publish / subscribe
                   ▼
              Redis (shared with Bull)
```

Chat fan-out:
```
  client A ─WS▶ gateway(node1) ─persist PG─▶ bus.publish("chat:42", msg)
                                              │
                         Redis "chat:42" ────┼──▶ node1 sub ▶ local sockets
                                             ├──▶ node2 sub ▶ local sockets
                                             └──▶ node3 sub (no local members)
```

## Open Decisions (confirm before implementation)

| # | Decision | Recommended | Alternative |
|---|----------|-------------|-------------|
| 1 | WS library | raw `ws` (honors viconf proposal) | Socket.IO (rooms+adapter+reconnect built-in, different protocol) |
| 2 | Placement | new `src/realtime/` shared module | each module owns its WS |
| 3 | Video affinity | sticky LB by `roomId` (D4-X) | Redis room-registry routing (D4-Y) |
| 4 | Bus unification | one Redis backbone for fan-out + events | separate transports |
| 5 | Interim chat | REST polling until gateway ready | block chat on gateway |

## Testing (Fearless Competence)

- **Unit:** `LocalEventBus` — publish→subscribe delivery, subscribe/unsubscribe ref-counting, no Redis. Chat use case tested with in-memory repos + in-memory bus.
- **E2E (new shape):** a `ws` client connects two sockets to the running app; a message sent via REST (or WS) is asserted on the *second* socket. Run against real PG + `RedisPubSubBus` (Redis in docker-compose).
- **Integration (multi-instance):** two app instances + Redis; assert a message published on instance 1 is received on a socket connected to instance 2 (true fan-out). Heavier; separate suite.

## Risks / Trade-offs

- [Best-effort pub/sub] A Redis blip drops in-flight messages; clients reconcile via REST `GET` on reconnect. Acceptable by design (PG = truth).
- [Video affinity] If D4-X (sticky LB) is chosen, the LB must be configured for `roomId` stickiness or video breaks under scale-out. Mitigation: D4-Y avoids LB changes but adds code.
- [ws vs Socket.IO] Raw `ws` means hand-rolling rooms/reconnect/heartbeat. Socket.IO would cut code but diverges from the viconf proposal's `ws` choice — deliberate call needed (Open Decision 1).
- [Shared kernel] The gateway becomes a cross-cutting dependency; changes here affect all realtime features. Mitigation: keep it thin, port-based, and unit-tested.
