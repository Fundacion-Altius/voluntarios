## Why

The Modulith rule states modules communicate only via **public interfaces or events** — never cross-module database joins or direct repository calls. Today **no event mechanism exists**: Redis is used only by Bull job queues, and modules (e.g. `community`) that need to notify users have no contract to emit through. The `add-notification-system` proposal calls itself the "communication backbone for blog, LMS, onboarding," but it currently creates notifications via direct service calls (the dual-write it set out to fix). There is no shared, typed way for one module to tell another "something happened."

This change defines the **inter-module domain-event contract**: a standard event envelope, a growing catalog of event types, publisher/subscriber ports in a shared kernel, and a **durable** transport. Producers emit; `add-notification-system` (and future consumers) subscribe. This is the public interface the Modulith rule requires.

## What Changes

- New shared-kernel `domain-events` module (recommended `src/events/`): the event envelope type, the event-type catalog, and `DomainEventPublisher` / `DomainEventSubscriber` ports.
- A **durable** event transport (Redis Streams, or Bull — see Open Decision 1) so events are not lost if a consumer is briefly offline. This is deliberately separate from the best-effort realtime pub/sub in `realtime-gateway` (which is for ephemeral client signals, not must-process domain events).
- Producers depend only on `DomainEventPublisher`. `community`'s already-declared `INotificationEventEmitter` port becomes an alias/implementation of `DomainEventPublisher`.
- `add-notification-system` subscribes and translates events into `Notification` rows (+ web push) — finally consuming a real contract instead of being called directly.

## Capabilities

### New Capabilities

- `domain-events`: A shared, typed domain-event contract (envelope + catalog + publisher/subscriber ports) backed by a durable transport, enabling modules to communicate via events instead of cross-module calls.

### Modified Capabilities

- `community-messaging` (emitter): `message.sent` is emitted via `DomainEventPublisher` (implements its declared `INotificationEventEmitter`).
- `add-notification-system` (consumer): subscribes to the event contract and creates notifications/pushes, replacing direct caller-created notifications with event-driven ones.

## Impact

- **Shared kernel:** new `src/events/` (envelope, catalog, ports). Owned by no feature module — like `users` / `realtime-gateway`.
- **Producers:** `community` (and later `lms-video-conferencing`, blog, courses, gamification, onboarding) emit via `DomainEventPublisher`. They never import another module's repository.
- **Consumer:** `add-notification-system` adds an event subscriber that maps event type → notification.
- **Infra:** uses the existing Redis (same instance as Bull / realtime-gateway), but a **durable** primitive (Streams or Bull) — not the ephemeral pub/sub.
- **No new DB tables for the contract itself**; the consumer's `notifications` table already exists.

### Relationship to other changes
- **`realtime-gateway`** provides WebSocket fan-out (best-effort pub/sub). Domain events are a *separate, durable* bus on the same Redis — distinct reliability needs. (Refines `realtime-gateway` design D5: `events.*` there = ephemeral realtime signals; this change = must-process domain events.)
- **`add-notification-system`** consumes this contract (its "backbone" role becomes real).
- **`community`** emits via it (closes `community` §9.2).

### Open Decisions (confirm during implementation — recommended lean stated)

1. **Durable transport:** Redis Streams (proper event log, consumer groups, replay — recommended) vs Bull queue (consistent with existing house pattern).
2. **Ownership:** new `src/events/` shared kernel (recommended) vs extend `add-notification-system`.
3. **Initial event scope:** community's 3 events now (`message.sent`, `project.created`, `project.member.added`); catalog extensible for blog/LMS/onboarding/gamification later.
4. **Idempotency:** consumers dedupe by event `id` (recommended).

Archived: 2026-07-15
