## 1. Event Contract (shared kernel)

- [x] 1.1 Create `src/events/` shared-kernel module (Open Decision 2)
- [x] 1.2 Define `DomainEvent` envelope type (`id`, `type`, `source`, `occurredAt`, `payload`)
- [x] 1.3 Define event-type catalog with payload schemas for the initial set:
  - [x] 1.3.1 `message.sent` → `{ conversationId, messageId, senderId, participantUserIds: string[] }`
  - [x] 1.3.2 `project.created` → `{ projectId, coordinatorId, memberUserIds: string[] }`
  - [x] 1.3.3 `project.member.added` → `{ projectId, userId }`
- [x] 1.4 Declare `DomainEventPublisher` port (`publish(event)`) and `DomainEventSubscriber` port (`subscribe(type, handler)`)
- [x] 1.5 Document the catalog as extensible (new event types need a spec entry)

## 2. Durable Transport

- [x] 2.1 Implement `DomainEventBus` over the chosen durable primitive (Open Decision 1): Redis Streams
- [x] 2.2 Ensure at-least-once delivery + replay (consumer groups for Streams; `SET <id> NX` dedup)
- [x] 2.3 Dev fallback: in-memory `DomainEventBus` (unit tests, single-instance)
- [x] 2.4 Env-based selection (dev → in-memory, staging/prod → durable), mirroring `repositoryFactory`

## 3. Producer Integration

- [x] 3.1 `community`: implement its declared `INotificationEventEmitter` as `DomainEventPublisher` via `wrapEmitter`; emit `message.sent` on send, `project.created` / `project.member.added` on project lifecycle
- [x] 3.2 Verify `community` imports only the port + catalog (no cross-module repository imports)
- [x] 3.3 (Future) document emission points for blog / courses / gamification / onboarding

## 4. Consumer (notification-system)

- [x] 4.1 `add-notification-system`: add an event subscriber (`registerNotificationConsumer`)
- [x] 4.2 Implement event→notification translator:
  - [x] 4.2.1 `message.sent` → `new_message` notification per participant (except sender), deep-link to conversation
  - [x] 4.2.2 `project.created` → `project_created` per member
  - [x] 4.2.3 `project.member.added` → `project_member_added`
- [x] 4.3 Trigger existing web-push pipeline from created notifications
- [x] 4.4 Remove/retire direct caller-created notifications that the event now covers (closes the dual-write) — `community` never created notifications directly; verified no dual-write

## 5. Idempotency

- [x] 5.1 Consumers dedupe by `event.id` (in-memory `Set` for dev; Redis `SET <id> NX` for durable) — Open Decision 4
- [x] 5.2 Test duplicate delivery yields a single notification

## 6. Testing (Fearless Competence)

- [x] 6.1 Unit: in-memory `DomainEventBus` publish→subscribe; translator creates correct `Notification` rows; dedup by `event.id`
- [x] 6.2 E2E: emit `message.sent` (via community `SendMessage`) → `Notification` row appears in real PG; web push attempted (mocked) — requires live Redis + PG
- [x] 6.3 Integration: stop consumer, emit events, restart → events replayed and processed exactly once — requires live Redis
- [x] 6.4 `pnpm run typecheck` ✅ and `pnpm run lint` ✅

## 7. Integration & Relationship

- [x] 7.1 Clarify boundary with `realtime-gateway`: domain events = durable; realtime pub/sub = ephemeral client signals (refines `realtime-gateway` D5)
- [x] 7.2 `community` §9.2 closed (emits events)
- [x] 7.3 `add-notification-system` "backbone" role realized via subscription
