## 1. Docker Setup — Postgres Container

- [x] 1.1 Add `postgres:16-alpine` service to `docker-compose.yml`, remove MariaDB service
- [x] 1.2 Create `init.pg.sql` — create `voluntarios` and `test` databases, create `voluntarios_user` role
- [x] 1.3 Update `.env.example`: change `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` for Postgres defaults; keep `SUPABASE_DB_*` vars for production
- [x] 1.4 Verify `docker compose up -d` starts Postgres on port 5432 and accepts connections

## 2. Drizzle Kit — Postgres Migration Pipeline

- [x] 2.1 Create `drizzle.pg.config.ts` — read schema from `src/db/schema/pg/`, output to `drizzle/pg/`
- [x] 2.2 Add scripts to `package.json`: `db:pg:generate` and `db:pg:push`
- [x] 2.3 Run `db:pg:generate` to create initial migration snapshot from `pg/` schema files
- [x] 2.4 Remove `drizzle.config.ts` (MySQL) and `drizzle/` (MySQL migrations)

## 3. Postgres Drizzle Repos — Contract

- [x] 3.1 Write tests for `pgContractRepository` — CRUD, pagination, search, area filter, role filter, sort
- [x] 3.2 Implement `pgContractRepository.ts` — reuse existing `infra/pg/` file, ensure it works with Drizzle + postgres.js and supports JSONB `@>` containment, ILIKE search, pagination
- [x] 3.3 Verify contract repo handles `JSONB` serialization for `areas`, `modalidad`, `firma` columns

## 4. Postgres Drizzle Repos — User

- [x] 4.1 Write tests for `pgUserRepository` — CRUD, findByEmail, findByEmailWithPassword, roles
- [x] 4.2 Implement `pgUserRepository.ts` — matches `IUserRepository` interface, singleton pattern with async self-seeding

## 5. Postgres Drizzle Repos — Survey Entities

- [x] 5.1 Write tests for `pgSurveyRepository` — CRUD
- [x] 5.2 Implement `pgSurveyRepository.ts`
- [x] 5.3 Write tests for `pgQuestionRepository` — CRUD
- [x] 5.4 Implement `pgQuestionRepository.ts`
- [x] 5.5 Write tests for `pgSurveyAnswerRepository` — CRUD
- [x] 5.6 Implement `pgSurveyAnswerRepository.ts`
- [x] 5.7 Write tests for `pgSurveySubmissionRepository` — CRUD
- [x] 5.8 Implement `pgSurveySubmissionRepository.ts`

## 6. Repository Factory — Wire Everything

- [x] 6.1 Extend `repositoryFactory.ts` — add `getContractRepository()`, `getUserRepository()` functions
- [x] 6.2 Update existing `getSurvey*Repository()` functions to return Postgres repos for staging and production
- [x] 6.3 Update `NODE_ENV` logic: `development` → in-memory, `staging` → local Postgres, `production` → Supabase Postgres
- [x] 6.4 Ensure connection strings differ per env (local env vars vs `SUPABASE_DB_*`)

## 7. Controllers — Migrate to Factory

- [x] 7.1 Refactor `contractController.ts` — replace inline env-based repo selection with `getContractRepository()` from factory
- [x] 7.2 Refactor `authController.ts` — use factory instead of hardcoded `supabaseUserRepository()`
- [x] 7.3 Refactor `authMiddleware.ts` — use factory instead of hardcoded Supabase user repo
- [x] 7.4 Refactor `userController.ts` — use factory instead of hardcoded Supabase user repo
- [x] 7.5 Update `src/index.ts` staging startup check — replace MariaDB connection check with Postgres equivalent
- [x] 7.6 Update `src/db/init.ts` — switch from raw SQL to Drizzle migration-based init for production

## 8. Remove Legacy Code

- [x] 8.1 Delete `src/infra/mariaDB/` — all MariaDB repo files and tests
- [x] 8.2 Delete `src/db/schema/mysql/` — MySQL Drizzle schema directory
- [x] 8.3 Delete `src/infra/supabase/` — Supabase REST repos (after confirming no remaining references)
- [x] 8.4 Remove `mysql2` from `package.json` (if no longer needed)
- [x] 8.5 Remove `@supabase/supabase-js` from `package.json` (if no longer needed)
- [x] 8.6 Clean up any remaining `import` of MariaDB or Supabase symbols across the codebase

## 9. Update AGENTS.md

- [x] 9.1 Update AGENTS.md to reflect new architecture: single Drizzle + Postgres pattern, removal of MariaDB/Supabase REST, new docker-compose, new migration scripts

## 10. Verification

- [x] 10.1 Run `pnpm run typecheck` — no errors
- [x] 10.2 Run `pnpm test` — all tests pass (existing in-memory tests unaffected)
- [x] 10.3 Run `pnpm run lint` — no errors
- [x] 10.4 Run Postgres Docker container and verify staging startup applies migrations
- [x] 10.5 Verify contract CRUD works against local Postgres (manual or e2e)
