## Why

The current backend has no runtime request validation (manual `if` checks in `utils.ts`), no API documentation, and no security headers. The frontend uses ad-hoc `fetch()` calls with manual typing, no caching layer, and state management scattered across components. This makes the stack brittle, hard to debug, and difficult for new developers to understand the API contract.

## What Changes

- **Backend**: Install and configure Zod for runtime request validation; generate OpenAPI 3.1 spec from Zod schemas via `@asteasolutions/zod-to-openapi`; serve interactive API docs via Scalar (instead of SwaggerUI, to avoid Helmet CSP conflicts); add Helmet for security headers.
- **Frontend**: Install `@hey-api/openapi-ts` with TanStack Query plugin; generate typed client and TanStack Query hooks from the backend's OpenAPI spec in a `predev` script; refactor existing data-fetching into separated custom hooks under `src/hooks/` using TanStack Query.
- **Infrastructure**: Backend generates OpenAPI spec dynamically at startup, served at `GET /api/openapi.json`. Docs UI at `GET /api-docs`. Frontend codegen runs via `predev` pointing to the local backend URL.

## Capabilities

### New Capabilities
- `request-validation`: Zod-based validation middleware for all API request inputs (body, query, params)
- `api-documentation`: OpenAPI 3.1 spec generation from Zod schemas + interactive Scalar docs UI
- `security-headers`: Helmet middleware with default CSP configuration
- `typed-api-client`: Auto-generated TypeScript client and TanStack Query hooks from OpenAPI spec via `@hey-api/openapi-ts`
- `frontend-state-management`: TanStack Query provider + separated custom hooks for server state

### Modified Capabilities
- (none — all new capabilities)

## Impact

- `voluntarios-back/`: New deps (`zod`, `@asteasolutions/zod-to-openapi`, `@scalar/api-reference`, `helmet`); new `src/schemas/` directory; new `src/openapi/` registry; modify `src/index.ts` to add Helmet and docs routes; replace manual validation in controllers with Zod middleware.
- `voluntarios-front/`: New deps (`@tanstack/react-query`, `@hey-api/openapi-ts`, `@hey-api/client-fetch`); new `src/client/` (generated, gitignored); new `src/hooks/` directory; new provider in root layout; refactor `useContracts` and add new hooks; update `csrf.ts` to work with the generated client.
- **CI/dev**: Frontend `predev` script to run codegen; backend must be running for codegen to work.
