## Purpose

This specification defines the requirements for secure cookie-based authentication token storage.

## Requirements

### Requirement: Authentication tokens SHALL be stored in HTTP-only cookies
The system SHALL store JWT authentication tokens in HTTP-only cookies instead of returning them in the response body.

#### Scenario: Successful login stores token in cookie
- **WHEN** a user successfully authenticates with valid credentials
- **THEN** the system SHALL set an HTTP-only cookie containing the authentication token
- **AND** the response body SHALL NOT contain the token

#### Scenario: Token refresh stores new token in cookie
- **WHEN** a valid refresh token is provided
- **THEN** the system SHALL set a new HTTP-only cookie containing the refreshed authentication token
- **AND** the response body SHALL NOT contain the refreshed token

### Requirement: Cookies SHALL have secure attributes
All authentication cookies SHALL be configured with proper security attributes.

#### Scenario: Secure cookie attributes are set
- **WHEN** an authentication cookie is set
- **THEN** the cookie SHALL have the Secure attribute
- **AND** the cookie SHALL have the HttpOnly attribute
- **AND** the cookie SHALL have the SameSite=Lax attribute

### Requirement: Cookie-based authentication SHALL work with CORS
The system SHALL properly handle cookie-based authentication in cross-origin requests.

#### Scenario: CORS requests include credentials
- **WHEN** a frontend application makes a cross-origin request
- **THEN** the server SHALL include appropriate CORS headers to allow credentials
- **AND** the client SHALL send requests with credentials mode enabled

### Requirement: Token validation SHALL work with cookie-based tokens
The system SHALL validate authentication tokens from cookies the same way as tokens from other sources.

#### Scenario: Protected endpoints validate cookie tokens
- **WHEN** a request is made to a protected endpoint with a valid authentication cookie
- **THEN** the system SHALL validate the token from the cookie
- **AND** the request SHALL be authorized

#### Scenario: Invalid cookie tokens are rejected
- **WHEN** a request is made with an invalid or expired authentication cookie
- **THEN** the system SHALL reject the request with a 401 Unauthorized status
