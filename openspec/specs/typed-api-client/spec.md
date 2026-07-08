## Purpose

Typed API client and TypeScript types generated from the backend's OpenAPI spec, with auth integration.

## Requirements

### Requirement: TypeScript types generated from OpenAPI spec
The frontend SHALL use `@hey-api/openapi-ts` to generate TypeScript types and a typed API client from the backend's OpenAPI spec. Generated files SHALL be placed in `src/client/` and gitignored.

#### Scenario: Codegen produces types
- **WHEN** `@hey-api/openapi-ts` runs against the backend's `/api/openapi.json`
- **THEN** it SHALL produce TypeScript type definitions for all schemas, request bodies, and response types

#### Scenario: Codegen produces typed client
- **WHEN** codegen completes
- **THEN** it SHALL produce a typed fetch client with methods for all API endpoints

### Requirement: predev script for codegen
The frontend `package.json` SHALL have a `predev` script that runs `@hey-api/openapi-ts` before starting the Next.js dev server.

#### Scenario: predev runs on dev start
- **WHEN** `pnpm run dev` is executed in the frontend
- **THEN** the `predev` script SHALL run `openapi-ts` before `next dev`

#### Scenario: Graceful failure if backend not running
- **WHEN** the backend is not running and `predev` runs
- **THEN** the script SHALL fail gracefully with a warning message (not crash the dev server)

### Requirement: Auth token integration with generated client
The generated client SHALL be configured to send the auth token (from the existing `csrf.ts` module) on every authenticated request.

#### Scenario: Auth interceptor attached to client
- **WHEN** the generated client is created
- **THEN** it SHALL have a middleware/interceptor that reads `getAuthToken()` and sets the `Authorization: Bearer` header

#### Scenario: CSRF token sent on mutations
- **WHEN** a mutation (POST/PUT/DELETE) is made via the generated client
- **THEN** the `X-CSRF-Token` header SHALL be set from the `csrf_token` cookie
