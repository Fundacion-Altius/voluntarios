# Tech Stack

## Backend (`voluntarios-back/`)

| Technology | Choice | Justification |
|---|---|---|
| **Node.js + TypeScript** | Runtime | Ubiquitous in the ecosystem, strong typing for contract/domain models, large package ecosystem. |
| **Express 4** | HTTP framework | Mature, minimal, well-understood. No need for the complexity of NestJS or Fastify for this scope. |
| **Drizzle ORM** | Database ORM | Type-safe, lightweight, no hidden magic. SQL-like API maps cleanly to the repository pattern. Single code path for staging and production. |
| **postgres.js** | Database driver | Minimal, fast, works seamlessly with Drizzle. Same driver in staging and production. |
| **PostgreSQL 16** | Database | JSONB support for array fields (`areas`, `modalidad`), `@>` containment queries, robust and well-supported on Supabase and self-hosted. |
| **Bull (with Redis 7)** | Job queue | Delayed job scheduling (24h survey emails). Redis-backed for reliability in staging/production; in-memory fallback in dev. |
| **Nodemailer** | Email delivery | Simple, well-supported, works with any SMTP provider. |
| **Zod** | Validation | Schema validation at the API boundary. Composable, type-inferred, and works naturally with TypeScript. |
| **JWT (HTTP-only cookies)** | Auth | Stateless, secure against XSS when stored in HTTP-only cookies. Middleware-based role enforcement. |
| **Vitest** | Testing | Fast, supports ESM, compatible with existing Jest-like API. Supertest for API integration tests. |
| **Drizzle Kit** | Migrations | Generate and apply SQL migrations from the Drizzle schema. Single command for both staging and production. |
| **pdfkit / pdf-lib** | PDF generation | Generate signed contract PDFs for storage and download. |

## Frontend (`voluntarios-front/`)

| Technology | Choice | Justification |
|---|---|---|
| **Next.js 14 App Router** | Framework | SSR for legal pages, static generation where possible, built-in API route support. App Router for nested layouts and server components. |
| **React 18** | UI library | Industry standard. Large ecosystem, well-understood by the team. |
| **shadcn (Radix UI + Tailwind CSS)** | Component library | Accessible, unstyled primitives. Full control over look-and-feel. Easy to add components on demand. |
| **Tailwind CSS 4** | Styling | Utility-first, no runtime, small production bundles. |
| **TanStack React Query** | Data fetching | Caching, background refetch, loading states. Simplifies API state management. |
| **TanStack React Table** | Table / DataTable | Headless, flexible, supports pagination, sorting, filtering out of the box. |
| **next-auth** | Auth client | Works with JWT cookies, supports credentials provider, well-integrated with Next.js. |
| **@hey-api/client-fetch** | HTTP client | Lightweight fetch wrapper for type-safe API calls. |
| **Jest + @testing-library/react** | Unit testing | Standard React testing toolchain. next/jest handles Next.js configuration. |
| **Playwright** | E2E testing | Cross-browser, reliable selectors, network mocking. Migrated from Cypress for better DX. |

## Infrastructure & Tooling

| Technology | Purpose |
|---|---|
| **pnpm** | Package manager. Fast, disk-efficient, strict dependency isolation. Used in both packages. |
| **Docker Compose** | Local Postgres 16 + Redis 7 for staging-like development. |
| **ESLint (flat config) + Prettier** | Code quality and formatting. Enforced via ESLint plugin. |
| **Commitlint (conventional commits)** | Commit message convention for auto-changelog and history readability. |
| **OpenSpec** | Spec-driven development workflow. Each change starts with a spec proposal and is tracked through implementation. |

## Key Architectural Decisions

- **Repository pattern with `IRepository<T>`.** Every data access layer implements a common interface returning `Result<T>` discriminated unions. The `repositoryFactory.ts` picks the right implementation based on `NODE_ENV`. This makes the code testable without mocks and allows swapping storage without touching business logic.

- **Single Drizzle ORM + Postgres.** Both staging and production share one schema (`src/db/schema/pg/`), one driver (`postgres.js`), and one migration pipeline (Drizzle Kit). The earlier MariaDB Drizzle and Supabase REST paths have been removed.

- **In-memory dev mode.** When `NODE_ENV=development`, repositories backed by plain arrays replace Postgres repos. This gives instant startup, no Docker dependency, and fast test runs — while using the same interfaces.

- **JSONB for variable-schema fields.** Contract fields like `areas` and `modalidad` are stored as Postgres JSONB and queried with the `@>` containment operator. This avoids join tables for simple array-of-enum fields.

- **Bull + Redis for scheduling.** Survey emails are enqueued as Bull jobs with a 24-hour delay. In dev mode, `setTimeout` replaces Redis. The scheduler and worker are wired in `src/services/index.ts` and activated at startup.

- **Anonymous survey submission.** The survey submit endpoint (`POST /api/surveys/submit-answer`) requires no authentication. Surveys are genuinely anonymous, with no link back to the volunteer.

- **Flat directory structure.** The team chose to keep a flat layout over a modular monolith to minimize refactoring risk and keep cross-cutting concerns easy to find.
