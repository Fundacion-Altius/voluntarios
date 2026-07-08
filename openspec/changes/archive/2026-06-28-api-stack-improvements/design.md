## Context

The project has two independent packages: `voluntarios-back/` (Express + TypeScript) and `voluntarios-front/` (Next.js 14 App Router). Currently:

- **Backend**: No runtime validation library — uses manual field checks in `src/utils.ts`. No API documentation. No security headers middleware.
- **Frontend**: Manual `fetch()` calls via `src/app/lib/csrf.ts` with no caching. State via `useState` + one React Context. Already has `@tanstack/react-table` but no `@tanstack/react-query`.

Both packages use `pnpm` and path alias `@/` → `src/`.

## Goals / Non-Goals

**Goals:**
- Add Zod-based runtime validation to all backend request inputs
- Generate OpenAPI 3.1 spec automatically from Zod schemas (always in sync)
- Serve interactive API docs at `/api-docs` (public)
- Add Helmet security headers with default config
- Generate a typed frontend API client + TanStack Query hooks from the OpenAPI spec
- Separate frontend data-fetching logic into `src/hooks/` using TanStack Query

**Non-Goals:**
- Not replacing Drizzle ORM schemas — Zod is for runtime API validation, Drizzle is for DB types
- Not changing the authentication system (cookie JWT + CSRF remains)
- Not adding frontend form validation (Zod on frontend is out of scope)
- Not modifying the existing `@tanstack/react-table` usage

## Decisions

### 1. Zod → OpenAPI: `@asteasolutions/zod-to-openapi` over `zod-openapi` or manual JSON Schema

- **Chosen**: `@asteasolutions/zod-to-openapi` v8 (Zod v4 compatible)
- **Rationale**: Mature (241 dependents), supports `OpenAPIRegistry` pattern for central collection, generates full OpenAPI 3.1 spec including paths, components, and parameters from Zod schemas. The `zod-openapi` alternative is newer with fewer dependents (77).
- **Pattern**: Single `OpenAPIRegistry` instance in `src/openapi/registry.ts`; all route definitions register their schemas there. `src/openapi/generator.ts` produces the final spec.

### 2. Interactive docs: Scalar over SwaggerUI

- **Chosen**: `@scalar/api-reference` (served as Express middleware)
- **Rationale**: SwaggerUI requires `'unsafe-eval'` in CSP (issue #5817, known for years). Helmet's default CSP blocks it — the UI loads blank. Scalar uses a modern web component that works with strict CSP. Also visually cleaner, supports OpenAPI 3.1 natively, and is sponsored by the same ecosystem.
- **Trade-off**: Less familiar to some developers, but functionally identical.

### 3. Frontend codegen: `@hey-api/openapi-ts` with TanStack Query plugin

- **Chosen**: `@hey-api/openapi-ts` CLI + `@hey-api/client-fetch` + TanStack Query plugin
- **Rationale**: Generates both typed API client and TanStack Query hooks in one pass. The `predev` script keeps it in sync. Alternative `openapi-typescript` + `openapi-react-query` is lighter but requires more manual wiring.
- **Auth integration**: The generated client supports middleware for injecting auth tokens. We'll add an interceptor that reads the existing `getAuthToken()` from `csrf.ts`.

### 4. Validation middleware design

- **Chosen**: Factory middleware `validate(schema, source = 'body')` returning Express handler
- **Rationale**: Per-route application is explicit and composable. Supports `body`, `query`, `params` sources. Returns 400 with `{ errors: { field: message[] } }` shape.

### 5. Helmet before routes, docs route exempt from CSP

- **Chosen**: `app.use(helmet())` globally with default config. Scalar docs served at `/api-docs` — Scalar's web component works with default CSP, so no exemption needed.
- **Rationale**: Helmet defaults are safe. Scalar avoids the CSP conflict entirely.

## Risks / Trade-offs

- **Codegen dependency on backend**: Frontend `predev` requires backend running on `localhost:3001`. Mitigation: graceful fallback if backend not reachable (skip codegen, use existing types).
- **Scoped schemas per capability**: Zod schemas live in `src/schemas/` and must be kept in sync with routes. Mitigation: schemas imported directly by route definitions — impossible to desync.
- **Generated client size**: `@hey-api/openapi-ts` generates one file per endpoint. Mitigation: tree-shakeable output, only imported hooks are bundled.
- **Learning curve**: Team needs to learn Zod and TanStack Query patterns. Mitigation: conventions match widely-used libraries with extensive docs.
