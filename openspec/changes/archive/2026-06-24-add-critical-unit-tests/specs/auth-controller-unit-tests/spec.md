## ADDED Requirements

### Requirement: Login validates credentials and issues tokens
The `login` controller SHALL validate email/password and return JWT tokens on success.

#### Scenario: Login succeeds for valid credentials
- **WHEN** a POST request with valid email and matching password is processed by `login`
- **THEN** it SHALL set `auth_token` and `refresh_token` HTTP-only cookies and a CSRF cookie, and return a 200 response with user data

#### Scenario: Login returns 401 for invalid password
- **WHEN** a POST request with a valid email but incorrect password is processed by `login`
- **THEN** it SHALL return a 401 response

#### Scenario: Login returns 401 for non-existent email
- **WHEN** a POST request with an email that does not exist in the user repository is processed by `login`
- **THEN** it SHALL return a 401 response

### Requirement: Refresh rotates tokens
The `refresh` controller SHALL validate the refresh token and issue new tokens.

#### Scenario: Refresh succeeds with valid refresh token
- **WHEN** a POST request with a valid `refresh_token` cookie is processed by `refresh`
- **THEN** it SHALL issue new `auth_token` and `refresh_token` cookies and return 200

#### Scenario: Refresh returns 401 when no refresh token cookie is present
- **WHEN** a POST request without a `refresh_token` cookie is processed by `refresh`
- **THEN** it SHALL return a 401 response

#### Scenario: Refresh returns 401 when refresh token is expired or invalid
- **WHEN** a POST request with an expired or malformed `refresh_token` cookie is processed by `refresh`
- **THEN** it SHALL return a 401 response

### Requirement: Logout blacklists tokens and clears cookies
The `logout` controller SHALL blacklist both tokens and clear all auth cookies.

#### Scenario: Logout clears cookies and blacklists tokens
- **WHEN** a POST request with valid `auth_token` and `refresh_token` cookies is processed by `logout`
- **THEN** it SHALL add both tokens to the blacklist, clear `auth_token`, `refresh_token`, and CSRF cookies, and return 200
