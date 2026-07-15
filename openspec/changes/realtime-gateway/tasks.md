## 1. Gateway Scaffolding

- [x] 1.1 Create shared `src/realtime/` platform module (placement per Open Decision 2 — recommended `src/realtime/`)
- [x] 1.2 Add `ws` dependency to `voluntarios-back/package.json` (raw `ws`; Open Decision 1)
- [x] 1.3 Attach a `WebSocketServer` to the existing HTTP server (handle `upgrade`, ignore non-WS paths so Express keeps REST)
- [x] 1.4 Wire gateway bootstrap into the app entry (`src/index.ts`) after the HTTP server starts
- [x] 1.5 Heartbeat / ping-pong to drop dead sockets

## 2. Auth & Connection Registry

- [x] 2.1 Authenticate WS `upgrade` via the shared mechanism (read session cookie / JWT → `user_id`)
- [x] 2.2 Reject unauthenticated upgrades with `401`/close
- [x] 2.3 Implement `ConnectionRegistry`: per-instance `Map<user_id, Set<socket>>`, add on connect, remove on close
- [x] 2.4 Expose registry to handlers (authenticated context per socket)

## 3. RealtimeBus Port + Implementations

- [x] 3.1 Declare `RealtimeBus` port: `publish(channel, payload)`, `subscribe(channel, handler)`, `unsubscribe(channel)`
- [x] 3.2 Implement `LocalEventBus` (in-memory Map; dev + unit tests)
- [ ] 3.3 Implement `RedisPubSubBus` using `ioredis` (reuse existing `REDIS_URL`), with channel subscribe/unsubscribe
- [x] 3.4 Env-based selection (dev → Local, staging/prod → Redis), mirroring `repositoryFactory` pattern
- [x] 3.5 Wire the selected bus into the gateway

## 4. Chat Handler (broadcast fan-out)

- [x] 4.1 Register chat handler; on socket join of a conversation, `subscribe("chat:<conversationId>")` (ref-counted per node)
- [x] 4.2 On `chat:<conversationId>` publish, write payload to all local sockets viewing that conversation (via `ConnectionRegistry`)
- [x] 4.3 On socket leave/disconnect, `unsubscribe` when ref-count hits 0
- [x] 4.4 `community`'s `RealtimePublisher` port implemented by this bus (unblocks `community` §9.1)

## 5. Video Handler (instance-affine routing)

- [x] 5.1 Register video/signaling handler; relay JSON signaling messages to `RoomManager`
- [ ] 5.2 Implement instance affinity per Open Decision 3: sticky LB by `roomId` (D4-X, recommended) OR Redis room-registry routing (D4-Y)
- [ ] 5.3 Ensure mediasoup signaling reaches the instance owning the room's worker

## 6. Domain-Event Backbone (Thread D enablement)

- [ ] 6.1 Reserve `events.*` channel namespace on the same `RedisPubSubBus`
- [ ] 6.2 `INotificationEventEmitter` (declared in `community`) publishes to `events.*`; subscription consumed by `add-notification-system` later

## 7. Testing (Fearless Competence)

- [x] 7.1 Unit: `LocalEventBus` publish→subscribe, subscribe/unsubscribe ref-counting (no Redis)
- [x] 7.2 Unit: chat use case with in-memory repos + in-memory bus (no realtime I/O)
- [x] 7.3 E2E: two `ws` clients connect; message sent via REST/WS asserted on the second socket (real PG + `RedisPubSubBus`)
- [ ] 7.4 Integration: two app instances + Redis; assert cross-instance fan-out (message on instance 1 → socket on instance 2)
- [x] 7.5 `pnpm run typecheck` ✅ and `pnpm run lint` ✅

## 8. Integration with Dependent Changes

- [x] 8.1 `community`: implement `RealtimePublisher` via the bus; add WS-client chat E2E (closes `community` §9.1)
- [ ] 8.2 `lms-video-conferencing`: route mediasoup signaling through this gateway instead of a standalone WS server
