## 1. Dependencies & Configuration

- [x] 1.1 Install packages: `drizzle-orm`, `drizzle-kit`, `postgres` (for Supabase PG driver)
- [x] 1.2 Create `drizzle.config.ts` at project root with MariaDB connection env vars and schema path for `mysql`
- [x] 1.3 Create `src/db/index.ts` — centralized Drizzle client initialization: MariaDB pool → `drizzle(pool)` for staging, PostgreSQL client → `drizzle(pgClient)` for production

## 2. MySQL Schema Definitions (MariaDB)

- [x] 2.1 Create `src/db/schema/mysql/contratos.ts` — Drizzle schema for `contratos` table with all 17 columns from `contratos.sql`
- [x] 2.2 Create `src/db/schema/mysql/encuestas.ts` — Drizzle schema for `encuestas` table
- [x] 2.3 Create `src/db/schema/mysql/preguntas.ts` — Drizzle schema for `preguntas` table with foreign key to `encuestas`
- [x] 2.4 Create `src/db/schema/mysql/surveyAnswers.ts` — Drizzle schema for `survey_answers` table with foreign keys
- [x] 2.5 Create `src/db/schema/mysql/surveySubmissions.ts` — Drizzle schema for `survey_submissions` table with foreign key to `encuestas`
- [x] 2.6 Create `src/db/schema/mysql/users.ts` — Drizzle schema for `users` table with unique email constraint
- [x] 2.7 Create `src/db/schema/mysql/index.ts` — re-export all MySQL schemas and set up relations (Survey hasMany Questions, etc.)

## 3. PostgreSQL Schema Definitions (Supabase)

- [x] 3.1 Create `src/db/schema/pg/contratos.ts` — Drizzle pg-core schema for `contratos` (jsonb for JSON columns, timestamptz for dates)
- [x] 3.2 Create `src/db/schema/pg/encuestas.ts` — Drizzle pg-core schema for `encuestas`
- [x] 3.3 Create `src/db/schema/pg/preguntas.ts` — Drizzle pg-core schema for `preguntas`
- [x] 3.4 Create `src/db/schema/pg/surveyAnswers.ts` — Drizzle pg-core schema for `survey_answers`
- [x] 3.5 Create `src/db/schema/pg/surveySubmissions.ts` — Drizzle pg-core schema for `survey_submissions`
- [x] 3.6 Create `src/db/schema/pg/users.ts` — Drizzle pg-core schema for `users`
- [x] 3.7 Create `src/db/schema/pg/index.ts` — re-export all PG schemas and relations

## 4. Generate Drizzle Types

- [x] 4.1 Run `drizzle-kit generate` against MySQL schema to verify config works
- [x] 4.2 Create `src/db/types.ts` — shared type aliases mapping Drizzle `$inferSelect` / `$inferInsert` to the existing entity names (`DatosContrato`, `Survey`, etc.) so controllers don't import Drizzle internals
- [x] 4.3 Update existing entity imports across codebase to use `src/db/types.ts` instead of `src/entities/*.ts`

## 5. Migrate MariaDB Repository

- [x] 5.1 Update `src/infra/mariaDB/mariaDBRepository.ts` — initialize Drizzle client from pool, replace all `conn.query()` calls with Drizzle query builder
- [x] 5.2 Verify `getAll` uses `db.select().from(contratos)`
- [x] 5.3 Verify `getById` uses `db.select().from(contratos).where(eq(contratos.id, id))`
- [x] 5.4 Verify `create` uses `db.insert(contratos).values(values)`
- [x] 5.5 Verify `update` uses `db.update(contratos).set(...).where(eq(contratos.id, id))`
- [x] 5.6 Verify `delete` uses `db.delete(contratos).where(eq(contratos.id, id))`
- [x] 5.7 Remove raw `mariadb` queries — the `handleDatabaseError` function and pool import stay for connection management

## 6. Migrate Supabase Repository

- [x] 6.1 Initialize Drizzle PostgreSQL client in `src/infra/supabase/supabaseRepository.ts`
- [x] 6.2 Replace `supabase.from("contratos").select("*")` in contract repository with Drizzle query
- [x] 6.3 Replace `supabase.from("encuestas").select("*")` in survey repository with Drizzle query
- [x] 6.4 Replace `supabase.from("preguntas").select("*")` in question repository with Drizzle query
- [x] 6.5 Replace `supabase.from("survey_answers").select("*")` in survey answer repository with Drizzle query
- [x] 6.6 Replace `supabase.from("survey_submissions").select("*")` in survey submission repository with Drizzle query
- [x] 6.7 Keep Supabase client import for `getReport` RPC method only
- [x] 6.8 Remove all other `supabase.from(...)` calls after migration

## 7. Cleanup & Testing

- [x] 7.1 Remove hand-written entity files: `src/entities/DatosContrato.ts` (if exists), `src/entities/Survey.ts`, `src/entities/Question.ts`, `src/entities/SurveyAnswer.ts`, `src/entities/SurveySubmission.ts`, `src/entities/User.ts` — types now come from Drizzle
- [x] 7.2 Update `src/entities/types.ts` — remove or re-export only non-table types (`AreasT`, `FirmaT`, etc.)
- [x] 7.3 Update `src/entities/Repository.ts` — simplify `IRepository<T>` interface if Drizzle types replace some generic constraints
- [x] 7.4 Run `npm run typecheck` and fix all type errors
- [x] 7.5 Run `npm run test` (vitest) and fix any broken tests
- [x] 7.6 Start staging environment (`docker compose up` + `npm run staging`) and verify MariaDB queries work
- [x] 7.7 Verify Supabase queries work (run with `npm run dev:supa` if credentials available)
