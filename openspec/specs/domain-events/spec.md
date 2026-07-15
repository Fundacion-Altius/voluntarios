## Purpose

The system SHALL provide a shared, typed domain-event contract (a standard event envelope, an extensible catalog of event types, and publisher/subscriber ports in a shared kernel) backed by a durable transport, so that modules communicate by emitting and subscribing to events instead of calling each other directly or joining across module databases. This is the public interface the Modulith rule requires for inter-module communication.

## Requirements

### Requirement: Events have a standard envelope

The system SHALL define a domain-event envelope carrying a unique `id`, a `type`, the producing module `source`, an `occurredAt` timestamp, and a `payload` typed per event type.

#### Scenario: Well-formed event
- **WHEN** a module emits an event
- **THEN** the event SHALL include `id`, `type`, `source`, `occurredAt`, and `payload`

### Requirement: Events are emitted through a publisher port

The system SHALL provide a `DomainEventPublisher` port. Producer modules SHALL depend only on this port and the event catalog; they SHALL NOT import another module's repository or call another module directly.

#### Scenario: Producer emits without cross-module coupling
- **WHEN** `community` sends a chat message
- **THEN** it SHALL publish a `message.sent` event via `DomainEventPublisher`
- **THEN** `community` SHALL NOT import the notification module's repository

### Requirement: Events are delivered durably

The system SHALL deliver domain events over a durable transport (Redis Streams or Bull) such that events are not lost if a consumer is briefly offline, and SHALL support replay.

#### Scenario: Consumer offline during emission
- **WHEN** an event is emitted while its consumer is offline
- **THEN** the event SHALL be retained and processed after the consumer reconnects

### Requirement: Consumers subscribe and react

The system SHALL provide a `DomainEventSubscriber` port. A consumer (e.g. `add-notification-system`) SHALL subscribe by event type and translate events into its own domain (e.g. notifications + web push).

#### Scenario: message.sent creates notifications
- **WHEN** a `message.sent` event is consumed
- **THEN** the system SHALL create one `new_message` notification for each participant except the sender, with a deep link to the conversation

#### Scenario: project.created creates notifications
- **WHEN** a `project.created` event is consumed
- **THEN** the system SHALL create a `project_created` notification for each project member

### Requirement: Consumers are idempotent

Because delivery is at-least-once, the system SHALL dedupe events by `id` so a notification is created at most once per event.

#### Scenario: Duplicate delivery
- **WHEN** the same event `id` is delivered more than once
- **THEN** the system SHALL create the resulting notification only once

### Requirement: The event catalog is extensible

The system SHALL allow new event types to be added (e.g. for blog, LMS, onboarding, gamification) via the shared catalog, without changing the transport or ports.

#### Scenario: Adding a new event type
- **WHEN** a new event type is registered in the catalog
- **THEN** producers MAY emit it and consumers MAY subscribe to it without modifying the core contract
