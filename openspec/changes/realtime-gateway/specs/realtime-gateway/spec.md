## Purpose

The system SHALL provide a single, shared, authenticated realtime transport (WebSocket gateway) plus a pub/sub `RealtimeBus`, available to all modules via a port, that supports both **broadcast fan-out** (chat) and **instance-affine routing** (mediasoup signaling), and that can also carry domain events. It is shared infrastructure (a platform capability), not owned by any feature module.

## Requirements

### Requirement: A single shared authenticated WebSocket gateway

The system SHALL expose one WebSocket server on the existing HTTP process. `upgrade` requests SHALL be authenticated using the same session cookie / JWT as REST, and unauthenticated upgrades SHALL be rejected.

#### Scenario: Authenticated connection
- **WHEN** a client connects with a valid session
- **THEN** the system SHALL accept the WebSocket and attach the `user_id` to the connection

#### Scenario: Unauthenticated connection rejected
- **WHEN** a client connects without a valid session
- **THEN** the system SHALL reject the upgrade

### Requirement: The gateway exposes a connection registry

The system SHALL track, per instance, which `user_id` values are connected on which sockets, so handlers can address authenticated connections.

#### Scenario: Registry updated on connect/disconnect
- **WHEN** a user connects and later disconnects
- **THEN** the system SHALL add then remove that user's socket from the registry

### Requirement: A RealtimeBus port abstracts publish/subscribe

The system SHALL provide a `RealtimeBus` port (`publish`, `subscribe`, `unsubscribe`) with a local in-memory implementation (dev/test) and a Redis pub/sub implementation (staging/prod), selected by environment. Modules SHALL depend on the port, not on `ws` or Redis directly.

#### Scenario: Local bus delivers in-process
- **WHEN** a handler publishes to a channel it subscribes to
- **THEN** the local subscriber receives the payload

#### Scenario: Redis bus delivers across instances
- **WHEN** instance A publishes to a channel and instance B subscribes
- **THEN** instance B receives the payload via Redis

### Requirement: Chat uses broadcast fan-out

The system SHALL deliver a published chat message to every instance that has a local socket viewing that conversation, by subscribing per `chat:<conversationId>` channel and writing to local sockets.

#### Scenario: Cross-instance chat delivery
- **WHEN** a message for conversation 42 is published and a viewer of 42 is connected to another instance
- **THEN** that viewer's socket receives the message

### Requirement: Video signaling uses instance-affine routing

The system SHALL route mediasoup signaling to the instance that owns the room's state (via sticky load-balancing by `roomId` or a Redis room-registry), so signaling reaches the correct mediasoup worker.

#### Scenario: Signaling reaches the owning instance
- **WHEN** a peer sends signaling for room 42 and room 42's worker is on instance B
- **THEN** the signaling message is delivered to instance B

### Requirement: The bus can carry domain events

The system SHALL use the same pub/sub backbone to carry domain-event channels (e.g. `events.message.sent`), enabling modules such as `add-notification-system` to consume events without direct cross-module calls.

#### Scenario: Domain event published
- **WHEN** a feature publishes `events.message.sent`
- **THEN** subscribers on any instance receive the event
