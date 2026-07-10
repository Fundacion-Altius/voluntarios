## Purpose

Staff users authenticate via Microsoft Entra ID (Azure AD) using OAuth 2.0 / OpenID Connect. Only @fundacionaltius.org emails are allowed.

## Requirements

### Requirement: Users can log in with Microsoft Entra ID

The system SHALL authenticate staff users via Microsoft Entra ID (Azure AD) using OAuth 2.0 / OpenID Connect. Only users with an email in the @fundacionaltius.org domain SHALL be allowed to log in this way. Volunteers (non-staff) SHALL log in with email and password.

#### Scenario: Successful login with valid corporate email

- **WHEN** an unauthenticated user with a @fundacionaltius.org email navigates to the login page
- **WHEN** they click "Sign in with Microsoft"
- **WHEN** they complete the Microsoft authentication flow
- **THEN** the system creates or retrieves their user record
- **THEN** the system SHALL check their status: if `active`, redirect to admin dashboard; if `candidate`, display "still under review"
- **THEN** the system redirects them to the admin dashboard

#### Scenario: Login rejected for non-corporate email

- **WHEN** a user with an email not in the @fundacionaltius.org domain attempts to log in via Microsoft
- **THEN** the system SHALL reject the authentication attempt
- **THEN** the system SHALL display an error message: "Only @fundacionaltius.org emails are allowed"

#### Scenario: Token refresh on page reload

- **WHEN** an authenticated user reloads the page
- **THEN** the system SHALL silently validate their existing session
- **THEN** the system SHALL NOT redirect them to the login page

### Requirement: Backend validates Microsoft-issued tokens

The backend API SHALL validate access tokens (or ID tokens) issued by Microsoft Entra ID on every protected route request.

#### Scenario: Valid token grants access

- **WHEN** a request includes a valid Microsoft-issued Bearer token
- **THEN** the backend SHALL extract the user email and roles from the token claims
- **THEN** the backend SHALL allow the request to proceed

#### Scenario: Expired or invalid token is rejected

- **WHEN** a request includes an expired or malformed Bearer token
- **THEN** the backend SHALL respond with HTTP 401 Unauthorized

#### Scenario: Missing token is rejected

- **WHEN** a request to a protected route has no Authorization header
- **THEN** the backend SHALL respond with HTTP 401 Unauthorized

### Requirement: Non-staff users can log in with email and password

The system SHALL allow users with role `general` and status `active` to authenticate using email and password. Users with status `candidate`, `on-reserve`, or `inactive` SHALL NOT be able to log in.

#### Scenario: Active volunteer logs in with password

- **WHEN** a user with status `active` and role `general` submits valid email and password
- **THEN** the system SHALL create a session
- **THEN** the system SHALL redirect to the volunteer portal

#### Scenario: Candidate tries to log in

- **WHEN** a user with status `candidate` submits email and password
- **THEN** the system SHALL reject the login
- **THEN** the system SHALL display: "Your application is still being reviewed"

#### Scenario: Inactive volunteer tries to log in

- **WHEN** a user with status `inactive` submits email and password
- **THEN** the system SHALL reject the login
- **THEN** the system SHALL display: "Please contact the foundation to reactivate your account"

### Requirement: Users can set password via token link

The system SHALL allow users with status `active` and null `password_hash` to set a password using a secure token sent by email.

#### Scenario: Volunteer sets password after acceptance

- **WHEN** a newly accepted volunteer clicks the link in their acceptance email
- **THEN** the system SHALL validate the token
- **THEN** the system SHALL prompt them to set a password
- **THEN** the system SHALL confirm the password and create the hash
- **THEN** the system SHALL allow them to log in
