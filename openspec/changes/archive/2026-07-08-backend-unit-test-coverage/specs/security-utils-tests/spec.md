## Purpose

Unit tests for `csrfUtils.ts` (78 lines, 3 exported functions) and `middleware/validate.ts` (16 lines) — no mocking.

## Requirements

### Requirement: generateCSRFToken produces valid HMAC tokens

#### Scenario: Returns a 64-character hex string
- **WHEN** `generateCSRFToken` is called
- **THEN** it SHALL return a string matching `/^[a-f0-9]{64}$/`

#### Scenario: Returns unique tokens on successive calls
- **WHEN** `generateCSRFToken` is called twice
- **THEN** the two tokens SHALL be different

### Requirement: validateCSRFToken middleware validates request tokens

#### Scenario: Calls next() for safe HTTP methods (GET, HEAD, OPTIONS)
- **WHEN** `validateCSRFToken` is called with a GET request
- **THEN** it SHALL call `next()` without any validation

#### Scenario: Returns 403 when header token is missing
- **GIVEN** a POST request with no `x-csrf-token` header
- **WHEN** `validateCSRFToken` is called
- **THEN** it SHALL respond with 403 and error message

#### Scenario: Returns 403 when cookie token is missing
- **GIVEN** a POST request with `x-csrf-token` header but no `csrf_token` cookie
- **WHEN** `validateCSRFToken` is called
- **THEN** it SHALL respond with 403 and error message

#### Scenario: Returns 403 when tokens do not match
- **GIVEN** a POST request where header token differs from cookie token
- **WHEN** `validateCSRFToken` is called
- **THEN** it SHALL respond with 403 and error message

#### Scenario: Calls next() when both tokens match
- **GIVEN** a POST request with matching `x-csrf-token` header and `csrf_token` cookie
- **WHEN** `validateCSRFToken` is called
- **THEN** it SHALL call `next()`

### Requirement: csrfMiddleware generates token when missing and validates on state-changing requests

#### Scenario: Calls next() for exempt paths
- **GIVEN** a request to `/api/auth/login`
- **WHEN** `csrfMiddleware` is called
- **THEN** it SHALL call `next()` without any check or generation

#### Scenario: Generates CSRF cookie on first visit (no cookie exists)
- **GIVEN** a request with no `csrf_token` cookie
- **WHEN** `csrfMiddleware` is called
- **THEN** it SHALL set a `csrf_token` cookie via `res.cookie` and call `next()`

#### Scenario: Delegates to validateCSRFToken for state-changing request with cookie
- **GIVEN** a POST request with a `csrf_token` cookie
- **WHEN** `csrfMiddleware` is called
- **THEN** it SHALL call `validateCSRFToken` (which validates header vs cookie)

#### Scenario: Cookie options respect env vars
- **GIVEN** `COOKIE_SECURE=true`, `COOKIE_SAME_SITE=lax`, `COOKIE_DOMAIN=example.com` env vars
- **WHEN** `csrfMiddleware` generates a cookie
- **THEN** `res.cookie` SHALL be called with matching options

### Requirement: validate middleware validates request data with Zod schema

#### Scenario: Calls next() for valid body
- **GIVEN** a Zod schema and a request with valid body data
- **WHEN** `validate` middleware is called
- **THEN** it SHALL call `next()` and replace `req.body` with parsed data

#### Scenario: Returns 400 for invalid body
- **GIVEN** a Zod schema and a request with invalid body data
- **WHEN** `validate` middleware is called
- **THEN** it SHALL return 400 with field errors from Zod flatten

#### Scenario: Supports validation of query and params sources
- **GIVEN** a Zod schema with source='query'
- **WHEN** `validate` middleware is called
- **THEN** it SHALL parse `req.query` and replace it with parsed data on success
