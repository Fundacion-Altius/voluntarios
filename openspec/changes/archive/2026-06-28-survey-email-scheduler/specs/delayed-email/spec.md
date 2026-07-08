## ADDED Requirements

### Requirement: Email is scheduled 24 hours after contract signing
When a contract is signed, the system SHALL schedule a delayed email to be sent 24 hours later with a survey invitation link.

#### Scenario: Contract creation schedules a delayed email
- **WHEN** a contract is successfully created via POST /api/contracts
- **THEN** the system enqueues a Bull job with a 24-hour delay containing recipient email and survey link

#### Scenario: Email is sent after 24 hours
- **WHEN** 24 hours have passed since the contract was created
- **THEN** the Bull worker processes the job and sends an email via Nodemailer

#### Scenario: Email contains survey link
- **WHEN** the delayed email is sent
- **THEN** the email body includes a link to the survey page at `SURVEY_BASE_URL/encuesta` with the volunteer's context

#### Scenario: Scheduled email survives server restart
- **WHEN** the server restarts while a job is pending in the queue
- **THEN** the job is persisted in Redis and executed after restart

#### Scenario: Failed email send is retried
- **WHEN** the email send fails (e.g., SMTP server unreachable)
- **THEN** the Bull job is retried up to 3 times with exponential backoff

#### Scenario: Job is removed after successful send
- **WHEN** the email is sent successfully
- **THEN** the Bull job is marked as completed and removed from the active queue

### Requirement: Survey link is configurable
The system SHALL use an environment variable for the survey base URL so it differs per environment.

#### Scenario: SURVEY_BASE_URL env var controls link
- **WHEN** the email is generated
- **THEN** the survey link uses `SURVEY_BASE_URL` from environment variables

### Requirement: Notification history is stored
The system SHALL persist notification records for audit trail.

#### Scenario: Notification is stored with status
- **WHEN** a delayed email is sent (or fails)
- **THEN** the system stores a notification record with type, recipient, status (sent/failed), and timestamp
