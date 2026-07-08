## Context

The backend currently has three data access patterns:

```
DEV              STAGING              PRODUCTION
─────────        ──────────           ──────────
in-memory        Drizzle + mysql2     supabase-js REST
arrays           MariaDB 11           Supabase PG

                 pg/ schemas        mysql/ schemas
                 (unused at         (used here)
                  runtime)
```

Production doesn't use Drizzle ORM at all — it uses the supabase-js REST client with string table names. The `pg/` schema files exist but are only used by an unused `pgContractRepository.ts`. The `mysql/` schema files are used by staging but correspond to a different SQL dialect.

This means:
- Every schema change must be reflected in `mysql/`, `pg/`, `types.ts`, `init.ts`, and the Supabase dashboard
- Staging validates Drizzle + MySQL, but production uses REST + Postgres — gap in parity
- Two repo implementations per entity (MariaDB + Supabase) must be kept in sync

## Goals / Non-Goals

**Goals:**
- Single Drizzle ORM + Postgres access pattern for both staging and production
- All repos use the `pg/` schema files as the single source of truth
- Staging runs against local Postgres in Docker (offline-capable)
- Production runs against Supabase Postgres via Drizzle ORM + `postgres.js`
- Auth stays in Express middleware (no `supabase.auth`)
- Remove MariaDB entirely (repos, schemas, Docker container)
- Remove the supabase-js REST client code path

**Non-Goals:**
- Changing the in-memory repos used in development mode (they stay as-is for speed)
- Introducing new features beyond the data access unification
- Changing the frontend in any way
- Containerizing Postgres for production use (Supabase manages that)

## Decisions

### Decision 1: Drizzle ORM + postgres.js for both staging and production

The `postgres.js` driver is already a dependency. Drizzle ORM is already used by the MariaDB repos. The `pg/` schema files already exist. The only missing piece is the repo implementations.

**Alternatives considered:**
1. ✅ **Drizzle + postgres.js (chosen)** — already in deps, same pattern as existing MariaDB repos, type-safe
2. ❌ Keep MariaDB for staging and Supabase REST for prod — three patterns, low parity, high maintenance
3. ❌ Use Supabase client for staging too — requires online connection, conflicts with offline requirement
4. ❌ Use raw `postgres.js` without Drizzle — loses type safety with no benefit

### Decision 2: Shared pool pattern, one pool per repo

Each Postgres repo creates its own connection pool, matching the existing MariaDB pattern. The pool is created when the repo factory function is called.

**Alternatives considered:**
1. ✅ **Per-repo pool (chosen)** — matches existing pattern, low refactor risk
2. ❌ Singleton shared pool — cleaner but would change existing pattern across all repos
3. ❌ Connection pooling at the factory level — tight coupling between factory and pool lifecycle

### Decision 3: JSONB column for array fields

The `areas` and `modalidad` columns in `contratos` use JSONB in the `pg/` schema. Array containment queries use the Postgres `@>` operator via Drizzle's `sql` tagged template, replacing MySQL's `JSON_CONTAINS`.

**Alternatives considered:**
1. ✅ **JSONB with `@>` operator (chosen)** — native Postgres JSON support, performant with GIN indexes
2. ❌ Text array columns (`text[]`) — less flexible, different query syntax
3. ❌ JSON serialization in application code — loses database-level filtering

### Decision 4: Migrations via Drizzle Kit (PG)

Drizzle Kit generates Postgres migrations from the `pg/` schema files. This replaces the current MySQL migration pipeline. The `drizzle.config.ts` (MySQL) is removed, and `drizzle.pg.config.ts` is added.

**Alternatives considered:**
1. ✅ **Drizzle Kit (chosen)** — matches the existing migration strategy, schema-driven
2. ❌ Raw SQL migrations — manual, error-prone
3. ❌ Supabase migration system — requires online access

### Decision 5: Factory for all repo selection

The `repositoryFactory.ts` currently handles only survey repos. It will be extended to handle contract, user, and all survey entity repos. Controllers that currently hardcode repo selection (contractController, authController, userController, authMiddleware) will be refactored to use the factory.

**Alternatives considered:**
1. ✅ **Extended factory (chosen)** — single place for all repo selection logic
2. ❌ Inline env checks everywhere — duplicated logic, easy to miss a code path
3. ❌ DI container — over-engineering for this codebase

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|---|---|---|
| Supabase-specific features (like `.rpc('get_survey_report')`) not available via direct Postgres connection | Feature breaks in production | Audit all `supabase.rpc()` calls. If any exist, implement as PL/pgSQL functions in migrations or rewrite in application code |
| Direct Postgres connection bypasses Supabase RLS | Auth loophole | Express middleware already handles auth via JWT — no dependency on Supabase RLS confirmed |
| Connection string differs between staging (localhost) and production (Supabase) | Hardcoded config missed | Use factory that reads `SUPABASE_DB_HOST` for production vs `DB_HOST` for staging |
| Postgres migration needs to stay in sync with existing Supabase schema | Migration conflict | Generate initial snapshot migration from `pg/` schemas, apply to Supabase manually once |
| `@supabase/supabase-js` still imported somewhere deep | Dead dependency lingers | After removing all `supabase.from()` calls, grep for remaining `from('supabase'` or `@supabase/` imports |
