## ADDED Requirements

### Requirement: OpenAPI spec generation from Zod schemas
The backend SHALL generate a complete OpenAPI 3.1 specification from Zod schemas using `@asteasolutions/zod-to-openapi`. The spec SHALL include all API paths, request parameters, request bodies, response schemas, and authentication schemes.

#### Scenario: OpenAPI spec available as JSON
- **WHEN** a GET request is made to `/api/openapi.json`
- **THEN** the response SHALL be a valid OpenAPI 3.1 JSON document containing all registered routes and schemas

#### Scenario: Spec includes all contract endpoints
- **WHEN** the OpenAPI spec is generated
- **THEN** it SHALL include paths for `GET /api/contracts`, `GET /api/contracts/:id`, `POST /api/contracts`, `PUT /api/contracts/:id`, `DELETE /api/contracts/:id`

#### Scenario: Spec includes all auth endpoints
- **WHEN** the OpenAPI spec is generated
- **THEN** it SHALL include paths for `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/refresh`, `GET /api/auth/me`

#### Scenario: Spec includes all user endpoints
- **WHEN** the OpenAPI spec is generated
- **THEN** it SHALL include paths for all user CRUD and role management endpoints

#### Scenario: Spec documents Bearer token auth
- **WHEN** the OpenAPI spec is generated
- **THEN** it SHALL include a `securitySchemes` entry for Bearer JWT auth (header `Authorization: Bearer <token>`)

#### Scenario: Spec documents cookie auth
- **WHEN** the OpenAPI spec is generated
- **THEN** it SHALL include a `securitySchemes` entry for cookie-based auth (`auth_token` cookie)

### Requirement: Interactive API docs via Scalar
The backend SHALL serve interactive API documentation using `@scalar/api-reference` at the `/api-docs` route. The docs SHALL be publicly accessible (no auth required).

#### Scenario: Scalar UI loads at /api-docs
- **WHEN** a browser navigates to `/api-docs`
- **THEN** the Scalar API reference UI SHALL load and display all endpoints from the OpenAPI spec

#### Scenario: Users can test endpoints from docs
- **WHEN** a user clicks "Try it" on an endpoint in Scalar
- **THEN** they SHALL be able to send requests and see responses, using Bearer token auth configured in the docs UI

### Requirement: OpenAPI spec stays in sync
The OpenAPI spec SHALL be generated dynamically at server startup from the Zod schema registry, ensuring it is always up to date with the code.

#### Scenario: Spec regenerated on restart
- **WHEN** the server starts
- **THEN** the OpenAPI generator SHALL read all registered schemas from the `OpenAPIRegistry` and produce the current spec

## MODIFIED Requirements

(none)
