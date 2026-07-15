## Why

Two features now need realtime transport and neither has one: `community` (chat message delivery) and `lms-video-conferencing` (mediasoup WebRTC signaling). The backend currently has **no WebSocket server at all** — Redis is used only by Bull job queues. Building two separate WS servers would duplicate auth, connection management, and infrastructure, and would diverge in protocol.

This change introduces a **shared realtime platform** (`realtime-gateway`): one WebSocket server on the existing HTTP process, shared authenticated-connection handling, a `RealtimeBus` abstraction over Redis pub/sub, and pluggable per-module handlers. It is a **prerequisite** for live chat (`community` tasks §9.1) and for mediasoup signaling (`lms-video-conferencing`).

Crucially, chat and video have *opposite* realtime shapes: chat needs **broadcast fan-out** across all instances (state in PG), while video needs **instance affinity** (a mediasoup room lives on one process-bound worker). The gateway must support both routing strategies.

## What Changes

- New shared `RealtimeGateway` infrastructure (recommended placement: `src/realtime/`), **not** owned by any feature module.
- WebSocket server attached to the existing HTTP server; `upgrade` requests authenticated via the shared auth mechanism (cookie/JWT → `user_id`).
- A per-instance `ConnectionRegistry` (`user_id → Set<socket>`).
- A `RealtimeBus` **port** with two implementations: `LocalEventBus` (in-memory, dev/single-instance) and `RedisPubSubBus` (ioredis, staging/prod). Reuses the existing Redis instance.
- Module handlers register against the gateway: a **chat handler** (subscribes per `chat:<conversationId>` channel; broadcasts to local sockets) and a **video handler** (routes signaling to the instance owning the mediasoup room).
- The same Redis pub/sub backbone is intended to also carry domain events (e.g. `message.sent`) for `add-notification-system` (Thread D) — one infrastructure, two consumers.

## Capabilities

### New Capabilities

- `realtime-gateway`: A shared, authenticated WebSocket transport plus a pub/sub `RealtimeBus` that provides (a) broadcast fan-out for chat and (b) instance-affine routing for mediasoup signaling, available to all modules via a port.

### Modified Capabilities

- `community-messaging` (dependency): live message delivery is implemented here, unblocking `community` tasks §9.1.
- `lms-video-conferencing` (dependency): mediasoup signaling is served by this gateway rather than a standalone WS server.

## Impact

- **Backend:** new `src/realtime/` (gateway, auth middleware hook, connection registry, `bus/` port + Local + Redis impls, handler registration). New dependency `ws` (raw, consistent with `lms-video-conferencing` proposal) — *see Open Decision 1*.
- **Modules:** `community` and `lms-video-conferencing` depend on the `RealtimeBus`/**RealtimePublisher** port; they do not import `ws`/Redis directly.
- **Infra:** uses existing Redis (already in docker-compose via Bull). No new service required unless a sticky LB is chosen for video (Open Decision 3).
- **No DB schema changes** for the gateway itself (PG remains the source of truth for chat messages; pub/sub is best-effort).

### Open Decisions (confirm during implementation — recommended lean stated)

1. **Library:** raw `ws` (recommended — honors `lms-video-conferencing` proposal) vs Socket.IO (less code, different protocol).
2. **Placement:** new shared `src/realtime/` platform module (recommended).
3. **Video affinity:** sticky LB by `roomId` hash (recommended — simpler) vs Redis room-registry routing.
4. **Bus unification:** one Redis pub/sub backbone for client fan-out *and* domain events (recommended).
5. **Interim chat:** REST polling until gateway lands, or block chat on the gateway.
