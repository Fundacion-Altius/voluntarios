## Context

The backend currently has a split data layer:
- **MariaDB** (staging): Raw SQL via `mariadb` connection pool with hand-written queries in `mariaDBRepository.ts`
- **Supabase** (production): Supabase JS client with `.from().select()` chain methods in `supabaseRepository.ts`
- **In-memory** (development): Plain arrays in `inMemory*Repository.ts`

Each approach uses hand-written TypeScript interfaces (`entities/*.ts`) that must be manually kept in sync with the actual database schema. There is no compile-time validation that queries match column types.

Drizzle ORM provides a unified schema definition language that supports both PostgreSQL (Supabase) and MySQL/MariaDB, generates TypeScript types, and provides type-safe query builders.

## Goals / Non-Goals

**Goals:**
- Define Drizzle schemas for all 6 tables (contratos, encuestas, preguntas, survey_answers, survey_submissions, users)
- Generate TypeScript types from schema definitions
- Migrate MariaDB repository to use Drizzle queries
- Migrate Supabase repository to use Drizzle queries (via `drizzle-orm/pg-core` for PostgreSQL compatibility)
- Add `drizzle.config.ts` for migration tooling
- Replace hand-written entity interfaces with Drizzle-generated types

**Non-Goals:**
- Migrating in-memory repositories to Drizzle (they stay as-is)
- Database migrations (drizzle-kit migration files can be generated but existing tables are managed externally)
- Changing the repository pattern interface (`IRepository<T>`) — controllers should not need changes
- Removing the existing Sequelize/Supabase dependencies yet — Drizzle is added alongside initially
- Changing the contract filtering RBAC logic (that's in the add-auth-and-rbac change)

## Decisions

1. **`drizzle-orm/mysql-core` for MariaDB, `drizzle-orm/pg-core` for Supabase** — MariaDB uses MySQL-compatible schema, Supabase is PostgreSQL. Drizzle supports both dialects with the same API surface. The schema files are shared but the client initialization differs.

2. **Dual schema files approach** — Since MariaDB and Supabase have subtle differences (JSON column handling, default functions), we define two schema directories: `src/db/schema/mysql/` and `src/db/schema/pg/`. The core column definitions match; only dialect-specific annotations differ. An alternative considered was a single schema with conditional types, which is more complex and harder to maintain.

3. **`drizzle-orm` with raw driver, not Drizzle Sessions** — Use `drizzle(mariadbPool)` and `drizzle(pgClient)` directly. No need for the session-based API since this is a server-side Express app with a single connection pool. Alternatives considered: Drizzle Sessions (adds complexity without benefit here).

4. **`postgres.js` for Supabase PostgreSQL driver** — `postgres.js` is the recommended companion driver for Drizzle with PostgreSQL. It supports PostGIS and is well-typed. Alternatives considered: `pg` (more verbose), `@neondatabase/serverless` (unnecessary).

5. **Generated types replace entity interfaces gradually** — The Drizzle-generated `typeof contratos.$inferSelect` and `typeof contratos.$inferInsert` replace `DatosContrato` and its payload type. We create type aliases in a shared location so controllers don't import directly from Drizzle internals. Entity files are removed one by one as each repository is migrated.

6. **Supabase RPC calls preserved** — The `getReport` function in the survey repository uses a Supabase RPC (`get_survey_report`). This is not a table query and cannot be replaced by Drizzle. The Supabase client is kept for this single use case.

## Risks / Trade-offs

- **Two schema definitions** — Maintaining MySQL and PostgreSQL versions of the same schema creates drift risk. Mitigation: shared type constants for column names and extraction functions for common patterns.
- **JSON column handling** — MariaDB uses `JSON` type, PostgreSQL uses `jsonb`. Drizzle treats them subtly differently. Mitigation: test both paths with representative contract data.
- **Drizzle version compatibility** — Drizzle is fast-moving. Mitigation: pin exact versions in `package.json` and test after upgrades.
- **Supabase client leftover** — Keeping the Supabase client for RPC means we still depend on `@supabase/supabase-js`. Acceptable since RPCs are a Supabase-specific feature.
