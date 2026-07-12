## ADDED Requirements

### Requirement: Users can subscribe to push notifications

The system SHALL allow users to register their browser for Web Push notifications via the Push API and VAPID protocol.

#### Scenario: User subscribes to push
- **WHEN** a user grants notification permission and the browser provides a PushSubscription object
- **THEN** the system SHALL send `POST /api/push/subscribe` with the subscription endpoint, keys, and user agent
- **THEN** the system SHALL store the subscription in the `push_subscriptions` table

#### Scenario: User unsubscribes
- **WHEN** a user revokes notification permission or the browser calls `unsubscribe()`
- **THEN** the system SHALL send `POST /api/push/unsubscribe` with the subscription endpoint
- **THEN** the system SHALL remove the subscription from the database

### Requirement: System sends push notifications on events

The system SHALL deliver push notifications to subscribed users when relevant events occur.

#### Scenario: Push sent on new notification
- **WHEN** a notification is created for a user who has an active push subscription
- **THEN** the system SHALL send a push payload via the `web-push` library to all active subscriptions for that user
- **THEN** the push payload SHALL contain the notification title, body, and a click URL

#### Scenario: Expired subscription is cleaned up
- **WHEN** the push service returns a 410 Gone for a subscription
- **THEN** the system SHALL delete that subscription from the database

### Requirement: Service Worker handles push events

The frontend SHALL register a Service Worker that listens for push events and displays notifications.

#### Scenario: Push received while browser is open
- **WHEN** the Service Worker receives a `push` event
- **THEN** it SHALL call `self.registration.showNotification()` with the payload data

#### Scenario: Push received while browser is closed
- **WHEN** the Service Worker receives a `push` event while the page is not loaded
- **THEN** it SHALL display the notification through the operating system's native notification system

#### Scenario: User clicks notification
- **WHEN** a user clicks a push notification
- **THEN** the Service Worker SHALL open or focus the app at the URL specified in the payload's click URL

### Requirement: Push is optional and fails gracefully

The system SHALL not break if push is not configured.

#### Scenario: VAPID keys not configured
- **WHEN** `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` are not set in environment variables
- **THEN** the push subscribe endpoint SHALL return a clear error message
- **THEN** the service SHALL NOT crash or prevent in-app notifications from working
