## 1. Event Contract (shared kernel)

- [ ] 1.1 Create `src/events/` shared-kernel module (Open Decision 2)
- [ ] 1.2 Define `DomainEvent` envelope type (`id`, `type`, `source`, `occurredAt`, `payload`)
- [ ] 1.3 Define event-type catalog with payload schemas for the initial set:
  - [ ] 1.3.1 `message.sent` → `{ conversationId, messageId, senderId, participantUserIds: string[] }`
  - [ ] 1.3.2 `project.created` → `{ projectId, title, coordinatorId, memberUserIds: string[] }`
  - [ ] 1.3.3 `project.member.added` → `{ projectId, userId }`
- [ ] 1.4 Declare `DomainEventPublisher` port (`publish(event)`) and `DomainEventSubscriber` port (`subscribe(type, handler)`)
- [ ] 1.5 Document the catalog as extensible (new event types need a spec entry)

## 2. Durable Transport

- [ ] 2.1 Implement `DomainEventBus` over the chosen durable primitive (Open Decision 1): Redis Streams (recommended) or Bull queue
- [ ] 2.2 Ensure at-least-once delivery + replay (consumer groups for Streams; job retries for Bull)
- [ ] 2.3 Dev fallback: in-memory `DomainEventBus` (unit tests, single-instance)
- [ ] 2.4 Env-based selection (dev → in-memory, staging/prod → durable), mirroring `repositoryFactory`

## 3. Producer Integration

- [ ] 3.1 `community`: implement its declared `INotificationEventEmitter` as `DomainEventPublisher`; emit `message.sent` on send, `project.created` / `project.member.added` on project lifecycle
- [ ] 3.2 Verify `community` imports only the port + catalog (no cross-module repository imports)
- [ ] 3.3 (Future) document emission points for blog / courses / gamification / onboarding

## 4. Consumer (notification-system)

- [ ] 4.1 `add-notification-system`: add an event subscriber (consumer group)
- [ ] 4.2 Implement event→notification translator:
  - [ ] 4.2.1 `message.sent` → `new_message` notification per participant (except sender), deep-link to conversation
  - [ ] 4.2.2 `project.created` → `project_created` per member
  - [ ] 4.2.3 `project.member.added` → `project_member_added`
- [ ] 4.3 Trigger existing web-push pipeline from created notifications
- [ ] 4.4 Remove/retire direct caller-created notifications that the event now covers (closes the dual-write)

## 5. Idempotency

- [ ] 5.1 Consumers dedupe by `event.id` (unique constraint / processed-events store) — Open Decision 4
- [ ] 5.2 Test duplicate delivery yields a single notification

## 6. Testing (Fearless Competence)

- [ ] 6.1 Unit: in-memory `DomainEventBus` publish→subscribe; translator creates correct `Notification` rows; dedup by `event.id`
- [ ] 6.2 E2E: emit `message.sent` (via community `SendMessage`) → `Notification` row appears in real PG; web push attempted (mocked)
- [ ] 6.3 Integration: stop consumer, emit events, restart → events replayed and processed exactly once
- [ ] 6.4 `pnpm run typecheck` ✅ and `pnpm run lint` ✅

## 7. Integration & Relationship

- [ ] 7.1 Clarify boundary with `realtime-gateway`: domain events = durable; realtime pub/sub = ephemeral client signals (refines `realtime-gateway` D5)
- [ ] 7.2 `community` §9.2 closed (emits events)
- [ ] 7.3 `add-notification-system` "backbone" role realized via subscription
