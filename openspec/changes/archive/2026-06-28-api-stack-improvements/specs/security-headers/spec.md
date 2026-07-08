## ADDED Requirements

### Requirement: Helmet middleware enabled
The backend SHALL use the `helmet` middleware with default configuration to set secure HTTP headers on all responses.

#### Scenario: Helmet headers present on all responses
- **WHEN** any request is made to any backend route
- **THEN** the response SHALL include security headers set by Helmet (e.g., `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security`, `X-XSS-Protection: 0`)

### Requirement: Default Content-Security-Policy
Helmet SHALL apply its default Content-Security-Policy header. The Scalar docs UI at `/api-docs` SHALL work correctly under this default CSP (no `'unsafe-eval'` or `'unsafe-inline'` exceptions needed).

#### Scenario: CSP header present
- **WHEN** any API response is inspected
- **THEN** the `Content-Security-Policy` header SHALL be present with Helmet's default directives

#### Scenario: Scalar docs render under CSP
- **WHEN** a browser loads `/api-docs`
- **THEN** the Scalar UI SHALL render without CSP console errors

### Requirement: Helmet applied before all routes
Helmet middleware SHALL be registered early in the Express middleware chain, before route handlers, to ensure all responses are covered.

#### Scenario: Helmet is first middleware
- **WHEN** the server middleware stack is inspected
- **THEN** `helmet()` SHALL be applied before route handlers (after CORS)

## MODIFIED Requirements

(none)
