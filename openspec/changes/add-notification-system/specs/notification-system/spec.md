## ADDED Requirements

### Requirement: Notifications persist across server restarts

The system SHALL store notifications in a database table so they survive server restarts and are available for in-app display.

#### Scenario: Notification is created and persisted
- **WHEN** a system event triggers a notification creation (e.g., candidacy approved, booking confirmed)
- **THEN** the system SHALL insert a row in the `notifications` table with user_id, type, title, body, status, and created_at

#### Scenario: Dev environment uses in-memory store
- **WHEN** NODE_ENV is `development`
- **THEN** the system SHALL use `InMemoryNotificationRepository` instead of the PG implementation

### Requirement: Users can view their notification feed

The system SHALL expose a REST endpoint for authenticated users to retrieve their notifications.

#### Scenario: List unread notifications
- **WHEN** an authenticated user sends `GET /api/notifications?filter=unread`
- **THEN** the system SHALL return all notifications for that user where `read_at` is null, ordered by `created_at` descending

#### Scenario: List all notifications with pagination
- **WHEN** an authenticated user sends `GET /api/notifications?page=1&limit=20`
- **THEN** the system SHALL return a paginated list of the user's notifications with total count

### Requirement: Users can mark notifications as read

The system SHALL allow users to mark individual or all notifications as read.

#### Scenario: Mark single notification as read
- **WHEN** an authenticated user sends `PUT /api/notifications/:id/read`
- **THEN** the system SHALL set `read_at` to the current timestamp for that notification

#### Scenario: Mark all notifications as read
- **WHEN** an authenticated user sends `POST /api/notifications/read-all`
- **THEN** the system SHALL set `read_at` to the current timestamp for all unread notifications belonging to that user

### Requirement: Email sending does not auto-create notifications

The system SHALL decouple email sending from notification creation to eliminate duplicate records.

#### Scenario: sendEmail does not create notification
- **WHEN** an event triggers `sendEmail()` (e.g., candidacy approval email)
- **THEN** `sendEmail()` SHALL send the email and return success/failure
- **THEN** the system SHALL NOT create a notification record inside `sendEmail()`
- **THEN** the service that called `sendEmail()` SHALL explicitly create its own notification

### Requirement: Email templates render consistently

The system SHALL use a single template rendering engine for all email types.

#### Scenario: All templates use same renderer
- **WHEN** an email is sent using any template (`survey-invitation.html`, `candidatura-*.html`, `waitlist-notification.html`)
- **THEN** the system SHALL replace all `{{key}}` placeholders with the provided template data using the same regex-based engine
- **THEN** `emailTemplateService.ts` SHALL be removed and its functionality consolidated into `emailSender.ts`

### Requirement: Notifications appear in the portal header

The system SHALL display a bell icon with unread count in the portal and admin header areas.

#### Scenario: Bell shows unread count
- **WHEN** a user visits the portal or admin area
- **THEN** a bell icon SHALL display the count of unread notifications
- **THEN** clicking the bell SHALL show a dropdown with the 5 most recent unread notifications
- **THEN** the component SHALL poll `GET /api/notifications?filter=unread` every 30 seconds

#### Scenario: Clicking a notification marks it as read
- **WHEN** a user clicks a notification in the dropdown
- **THEN** the system SHALL send `PUT /api/notifications/:id/read`
- **THEN** the unread count SHALL decrement
