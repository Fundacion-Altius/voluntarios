## Context

The Modulith rule forbids cross-module database joins and direct repository calls; modules must talk via public interfaces or events. We confirmed there is **no event mechanism** in the backend — Redis serves only Bull job queues, and `community` declares an `INotificationEventEmitter` port with nothing to implement it against. `add-notification-system` is meant to be the "communication backbone" but currently relies on callers creating notifications directly (the dual-write anti-pattern it aimed to remove).

Two realtime needs were explored separately and must not be conflated:
- **Realtime fan-out** (`realtime-gateway`): best-effort WebSocket delivery of chat to connected clients. Redis **pub/sub** is appropriate — if a message blips, the client reconciles via REST.
- **Domain events** (this change): *must-process* facts ("a message was sent", "a project was created") that must survive a briefly-offline consumer and drive notifications/push. Pub/sub alone would **lose** these. They need a **durable** transport.

Hence this change defines a durable domain-event contract as a **shared kernel**, distinct from the ephemeral realtime bus, even though both live on the same Redis.

## Goals / Non-Goals

**Goals:**
- A typed event envelope + extensible event-type catalog in a shared kernel (`src/events/`).
- `DomainEventPublisher` / `DomainEventSubscriber` ports; producers and consumers depend only on these.
- A **durable** transport (Redis Streams or Bull) with at-least-once delivery and replay.
- `community` emits via it; `add-notification-system` consumes it.
- Idempotent consumers (dedupe by event `id`).

**Non-Goals (this change):**
- Building notification rendering/store/push logic (owned by `add-notification-system`).
- Defining every future event (blog/LMS/onboarding/gamification) — catalog is extensible; we seed community's 3.
- WebSocket delivery of events to browsers (that is `realtime-gateway`'s job; an event may *trigger* a realtime nudge, but the contract itself is transport-agnostic).
- Synchronous request/response across modules (out of scope; events are async fire-and-react).

## Decisions

### D1 — Shared-kernel `src/events/` owns the contract
The envelope, the catalog (event-type → payload shape), and the publisher/subscriber ports live in a neutral shared kernel, owned by no feature. This is the "public interface registry" the Modulith rule requires and that was missing.

### D2 — Event envelope
```
   DomainEvent = {
     id: string          // uuid; idempotency key
     type: string        // e.g. "message.sent"
     source: string      // producing module, e.g. "community"
     occurredAt: string  // ISO timestamp
     payload: Record<string, unknown>  // typed per event type
   }
```

### D3 — Durable transport, not pub/sub
Domain events use a **durable** primitive on the existing Redis:
- **Redis Streams** (recommended): append-only log, consumer groups, replay, at-least-once. The "proper" event backbone.
- **Bull queue** (house-consistent alternative): each event = a job; Bull gives durability + retries out of the box, matching existing `survey-email` / `weekly-ranking` usage.
Open Decision 1. Either way, **not** the best-effort pub/sub used for client fan-out.

### D4 — Producers emit, never call
`community`'s `INotificationEventEmitter` becomes an implementation of `DomainEventPublisher`. Producers import only the port + catalog; they never import another module's repository. This enforces the Modulith boundary.

### D5 — Consumer maps event → notification
`add-notification-system` subscribes and runs an **event→notification translator**:
- `message.sent` → for each `participantUserIds` except `senderId`, create `Notification(type: "new_message", link: "/portal/conversaciones/:conversationId")`.
- `project.created` → for each `memberUserIds`, create `Notification(type: "project_created", ...)`.
- `project.member.added` → `Notification(type: "project_member_added", ...)`.
Each notification creation may also trigger web push (existing `web-push` pipeline). The translator is the single place mapping events to user-facing alerts.

### D6 — Idempotency
At-least-once delivery means duplicates are possible. Consumers dedupe by `event.id` (unique constraint / processed-events set). Open Decision 4.

### D7 — No core leakage
The envelope, ports, and translator live at the boundary. Feature *use cases* call `DomainEventPublisher.publish(...)` and never touch Redis/Streams/Bull/Winston directly. Logging is at the subscriber perimeter.

## Architecture

```
   Producer modules                Shared Kernel: domain-events          Consumer
   ┌──────────────┐                ┌──────────────────────────┐          ┌──────────────────────┐
   │ community    │─publish(event)▶│ DomainEventPublisher port│          │ add-notification-    │
   │ (video,blog, │                │  ├ envelope + catalog     │─subscribe▶│ system (subscriber)  │
   │  courses,    │                │  ├ Subscriber port        │          │  ├ translator        │
   │  future)     │                │  └ DURABLE transport      │          │  ├ Notification repo  │
   └──────────────┘                │    (Streams | Bull)       │          │  └ web-push           │
                                   └──────────────────────────┘          └──────────────────────┘
        NO module imports another module's repository
```

Transport contrast:
```
   realtime-gateway : Redis PUB/SUB      → best-effort, client fan-out (chat)
   domain-events    : Redis STREAMS/BULL → durable, must-process (notifications)
```

## Open Decisions (confirm before implementation)

| # | Decision | Recommended | Alternative |
|---|----------|-------------|-------------|
| 1 | Durable transport | Redis Streams (event log, replay) | Bull queue (house-consistent) |
| 2 | Ownership | new `src/events/` shared kernel | extend `add-notification-system` |
| 3 | Initial events | community's 3 (`message.sent`, `project.created`, `project.member.added`) | broader seed |
| 4 | Idempotency | dedupe by `event.id` | rely on exactly-once (not guaranteed) |

## Testing (Fearless Competence)

- **Unit:** in-memory `DomainEventBus` — publish→subscribe delivery; assert `add-notification-system`'s translator creates the correct `Notification` rows from an event using the in-memory notification repo; assert dedup by `event.id`. No Redis.
- **E2E:** trigger `community`'s `SendMessage` (or emit `message.sent`); assert a `Notification` row appears in real PG; assert web push attempted (mocked VAPID). Run the durable transport against real Redis.
- **Integration:** stop the consumer, emit events, restart, assert events are replayed (durability) and processed exactly once.

## Risks / Trade-offs

- [Durability choice] Streams is the "right" primitive but newer in this codebase; Bull is familiar but job-shaped. Either is fine; decision recorded.
- [Dual-write regression] If any producer still creates notifications directly, the boundary leaks. Mitigation: grep all `INotificationRepository.create` callers; route them through events.
- [At-least-once] Consumers MUST be idempotent or users get duplicate notifications. Mitigation: `event.id` unique constraint.
- [Scope creep] The catalog could explode. Mitigation: seed 3 community events; require a new spec entry per added event type.
