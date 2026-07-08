## Why

The backend has three distinct data access patterns (in-memory arrays, MariaDB via Drizzle ORM, Supabase REST API) — one per environment. This creates a high maintenance burden (two schema directories, two repo implementations, manual sync between them) and low parity (staging tests Drizzle ORM against MySQL, but production uses supabase-js against Postgres). A staging-passing query can break in production because the access pattern differs entirely.

By consolidating staging and production onto Drizzle ORM + Postgres, we get one access pattern, one schema directory, and genuine parity between environments.

## What Changes

- **Remove** all MariaDB repos (`mariaDBRepository.ts`, `mariaDBUserRepository.ts`, `mariaDBSurvey*.ts`) — **BREAKING**
- **Remove** the `src/db/schema/mysql/` schema directory — **BREAKING**
- **Rewrite** the Supabase repos to use Drizzle ORM + `postgres.js` against Supabase's Postgres instead of the supabase-js REST client — **BREAKING**
- **Add** Docker Postgres container to replace MariaDB in docker-compose
- **Create** Postgres Drizzle repos for contract, user, survey, question, answer, submission entities
- **Update** `repositoryFactory.ts` to return new Postgres repos for both staging and production
- **Unwire** the existing `supabaseContractRepository` / `supabase*.ts` — they become dead code and are removed
- **Generate** Postgres Drizzle migrations (replacing the current MySQL-only `drizzle/` output)
- **Remove** Supabase REST API dependencies where possible (may still need `@supabase/supabase-js` for any Supabase-specific features)
- User auth stays in Express middleware (no `supabase.auth`)

## Capabilities

### New Capabilities

- `pg-repos`: Drizzle ORM + Postgres repos for all entities (contract, user, survey, question, answer, submission) — shared by staging and production
- `docker-postgres`: Local Postgres 16 container in docker-compose with init script and Drizzle migrations
- `drizzle-pg-migrations`: Postgres migration pipeline via Drizzle Kit replacing current MySQL migrations
- `factory-rewire`: Update repository factory and hardcoded repo selections to use new Postgres repos

### Modified Capabilities

- `database-setup`: Requirements change — local dev no longer needs MariaDB, switch to Postgres
- `contracts-prod-data-access`: Will be rewritten from supabase-js to Drizzle ORM + Postgres
- `repository-mock-tests`: In-memory repos remain for unit tests; no spec change needed

## Impact

- **Removed packages**: `mysql2`, `mariadb` (if direct driver used)
- **Kept packages**: `drizzle-orm`, `postgres.js` (already dependencies), `@supabase/supabase-js` (still needed if any Supabase-specific features remain)
- **Removed files**: 6 MariaDB repo files, `src/db/schema/mysql/` directory, `drizzle.config.ts` (MySQL), `drizzle/` (MySQL migrations)
- **Modified files**: `src/infra/repositoryFactory.ts`, `src/infra/supabase/supabaseRepository.ts` (rewritten), `src/api/controllers/contractController.ts` (remove inline mariaDB selection), `src/api/controllers/*` (switch from supabase-js to Drizzle PG repos), `src/index.ts` (staging connection check), `docker-compose.yml`, `.env.example`
- **New files**: `src/infra/pg/*` (all Postgres Drizzle repos), `drizzle.pg.config.ts`, `drizzle/pg/` (PG migrations), `init.pg.sql`
