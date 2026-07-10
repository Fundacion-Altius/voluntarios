## Purpose

The system SHALL allow external candidates to apply as volunteers through a public form or Excel import, provide admin review and processing, and manage the full candidate lifecycle.

## Requirements

### Requirement: External volunteers can apply through a public form

The system SHALL provide a public form at `/hazte-voluntario` where people can submit their volunteer application. The form SHALL collect: nombre y apellidos, email, teléfono, residencia, fecha de nacimiento, periodicidad deseada, días disponibles, disponibilidad horaria, actividades de interés, and a free-text field. The form SHALL be protected by rate limiting and CAPTCHA.

#### Scenario: Successful application submission
- **WHEN** a visitor submits the public form with valid data
- **THEN** the system SHALL create a User with status `candidate` and role `general`
- **THEN** the system SHALL NOT require a password for this user
- **THEN** the system SHALL send an email to the applicant confirming receipt
- **THEN** the system SHALL log the event in `user_status_log`

#### Scenario: Duplicate email detected
- **WHEN** a visitor submits the form with an email that already exists
- **THEN** the system SHALL check if the existing user's status is `on-reserve`
- **THEN** if `on-reserve`, the system SHALL inform the applicant they are already on the waitlist
- **THEN** if `active` or `inactive`, the system SHALL inform the applicant their email is already registered

#### Scenario: Rate limit exceeded
- **WHEN** more than 5 submissions come from the same IP in 10 minutes
- **THEN** the system SHALL respond with HTTP 429 Too Many Requests

### Requirement: Admin can bulk import candidates via Excel

The system SHALL allow admins to upload an Excel file with candidate data to create multiple Users at once with status `candidate`.

#### Scenario: Successful bulk import
- **WHEN** an admin uploads a valid Excel file with 20 candidate rows
- **THEN** the system SHALL create 20 Users with status `candidate`
- **THEN** the system SHALL send individual confirmation emails to each valid email
- **THEN** the system SHALL display a summary (X created, Y duplicates skipped)

#### Scenario: Excel with duplicate emails
- **WHEN** the Excel contains emails already in the system
- **THEN** the system SHALL skip those rows
- **THEN** the system SHALL report which rows were skipped and why

### Requirement: Admin can review and process candidates

The system SHALL provide an admin interface listing all candidates with their application data. Admins SHALL be able to accept a candidate (status → `active`) or put them on reserve (status → `on-reserve`).

#### Scenario: Admin accepts a candidate
- **WHEN** an admin clicks "Aceptar" on a candidate with status `candidate`
- **THEN** the system SHALL change the user's status to `active`
- **THEN** the system SHALL log the change in `user_status_log` with `changed_by` set to the admin
- **THEN** the system SHALL send an email to the volunteer with a link to set their password
- **THEN** the system SHALL redirect the candidate to the create-password page

#### Scenario: Admin puts a candidate on reserve
- **WHEN** an admin clicks "En reserva" on a candidate with status `candidate`
- **THEN** the system SHALL change the user's status to `on-reserve`
- **THEN** the system SHALL log the change in `user_status_log`
- **THEN** the system SHALL send an email notifying the applicant that there is no current availability

#### Scenario: Admin views candidate list
- **WHEN** an admin navigates to the candidates section
- **THEN** the system SHALL display all users with status `candidate` and `on-reserve`
- **THEN** the system SHALL show name, email, application date, and current status
- **THEN** the system SHALL show action buttons ("Aceptar", "En reserva") for `candidate` users

### Requirement: User status transitions are audited

The system SHALL maintain a `user_status_log` table that records every status change.

#### Scenario: Status change is logged
- **WHEN** any user's status changes
- **THEN** the system SHALL insert a row in `user_status_log` with: user_id, old_status (nullable), new_status, changed_by (admin ID or null for system changes), reason (nullable), created_at

### Requirement: Candidate can set password after acceptance

The system SHALL allow a user with status `active` and no password to set their password via a secure token link.

#### Scenario: Candidate sets password
- **WHEN** a user with status `active` clicks the link from the acceptance email
- **THEN** the system SHALL validate the token
- **THEN** the system SHALL allow them to set a password
- **THEN** the system SHALL allow them to log in and access the volunteer portal

### Requirement: Volunteers can be deactivated

The system SHALL allow admins to set a volunteer's status to `inactive`.

#### Scenario: Admin deactivates a volunteer
- **WHEN** an admin sets a volunteer's status to `inactive`
- **THEN** the system SHALL automatically cancel all future bookings for that volunteer
- **THEN** the system SHALL log the change in `user_status_log`
- **THEN** the volunteer SHALL NOT be able to log in or make new bookings
- **THEN** the volunteer SHALL retain their accumulated points and level

### Requirement: Inactive volunteers cannot access the portal

The system SHALL restrict access to the volunteer portal based on user status.

#### Scenario: Active volunteer can log in
- **WHEN** a user with status `active` provides valid credentials
- **THEN** the system SHALL grant access to the volunteer portal

#### Scenario: Candidate cannot log in
- **WHEN** a user with status `candidate` attempts to log in
- **THEN** the system SHALL reject the login attempt
- **THEN** the system SHALL display a message: "Your application is still being reviewed"

#### Scenario: Inactive volunteer cannot log in
- **WHEN** a user with status `inactive` attempts to log in
- **THEN** the system SHALL reject the login attempt
- **THEN** the system SHALL display a message: "Please contact the foundation to reactivate your account"
