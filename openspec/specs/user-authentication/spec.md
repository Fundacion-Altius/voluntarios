## Purpose

This specification defines the modified requirements for user authentication to support cookie-based token storage.

## Requirements

### Requirement: User authentication SHALL use cookie-based token storage
The user authentication system SHALL store authentication tokens in HTTP-only cookies instead of returning them in the response body.

#### Scenario: Login response includes authentication cookie
- **WHEN** a user successfully logs in with valid credentials
- **THEN** the system SHALL set an HTTP-only cookie containing the authentication token
- **AND** the response body SHALL NOT contain the token property
- **AND** the response SHALL indicate successful authentication

#### Scenario: Failed login does not set authentication cookie
- **WHEN** a user attempts to log in with invalid credentials
- **THEN** the system SHALL NOT set any authentication cookie
- **AND** the system SHALL return a 401 Unauthorized status
- **AND** the response body SHALL contain an appropriate error message

### Requirement: Authentication flow SHALL support cookie-based sessions
The authentication flow SHALL be updated to work with cookie-based token storage while maintaining the same user experience.

#### Scenario: Protected routes validate cookie tokens
- **WHEN** an authenticated user accesses a protected route
- **THEN** the system SHALL validate the authentication token from the cookie
- **AND** the user SHALL be granted access if the token is valid

#### Scenario: Session persistence across page reloads
- **WHEN** an authenticated user reloads the page or navigates within the application
- **THEN** the authentication cookie SHALL be automatically sent with requests
- **AND** the user SHALL remain authenticated without needing to log in again

### Requirement: CSRF protection SHALL be implemented for cookie-based authentication
The system SHALL implement CSRF protection for all state-changing requests when using cookie-based authentication.

#### Scenario: State-changing requests require CSRF token
- **WHEN** an authenticated user makes a POST, PUT, PATCH, or DELETE request
- **THEN** the system SHALL require a valid CSRF token
- **AND** the request SHALL be rejected with 403 Forbidden if the CSRF token is missing or invalid

#### Scenario: Safe requests do not require CSRF token
- **WHEN** an authenticated user makes a GET or HEAD request
- **THEN** the system SHALL NOT require a CSRF token
- **AND** the request SHALL be processed normally

### Requirement: Microsoft Authentication Integration
The system SHALL allow users to authenticate using their Microsoft accounts.

#### Scenario: Successful Microsoft Login
- **WHEN** user clicks "Login with Microsoft" button
- **THEN** system redirects to Microsoft authentication page
- **AND** after successful authentication, user is redirected back to the application
- **AND** user session is established

#### Scenario: Failed Microsoft Login
- **WHEN** user fails Microsoft authentication
- **THEN** system displays appropriate error message
- **AND** user remains on login page

### Requirement: User Session Management
The system SHALL maintain user sessions after successful authentication.

#### Scenario: Session Persistence
- **WHEN** user successfully authenticates with Microsoft
- **THEN** system creates a session cookie
- **AND** user remains logged in across page refreshes

#### Scenario: Session Expiration
- **WHEN** user session expires
- **THEN** system redirects user to login page
- **AND** user must re-authenticate
