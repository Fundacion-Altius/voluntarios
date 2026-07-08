## Purpose

24 hours after contract signing, the system sends a survey invitation email with a link to the survey page.

## Requirements

### Requirement: Email is scheduled 24 hours after contract signing

When a contract is signed, the system SHALL schedule a delayed email 24 hours later with a survey invitation link.

#### Scenario: Contract creation schedules a delayed email
- **WHEN** a contract is created via POST /api/contracts
- **THEN** the system enqueues a Bull job with a 24-hour delay

#### Scenario: Email is sent after 24 hours
- **WHEN** 24 hours have passed since contract creation
- **THEN** the Bull worker processes the job and sends email via Nodemailer

#### Scenario: Email contains survey link
- **WHEN** the delayed email is sent
- **THEN** the email body includes a link to `SURVEY_BASE_URL/encuesta`

#### Scenario: Scheduled email survives server restart
- **WHEN** the server restarts while a job is pending
- **THEN** the job is persisted in Redis and executes after restart

#### Scenario: Failed email send is retried
- **WHEN** the email send fails
- **THEN** the Bull job is retried up to 3 times with exponential backoff

### Requirement: Survey link is configurable

The system SHALL use `SURVEY_BASE_URL` env var for the survey base URL.

### Requirement: Notification history is stored

The system SHALL persist notification records with type, recipient, status, and timestamp.
