## 1. Fix Postgres.js connection to Supabase

- [x] 1.1 Add SUPABASE_DB_HOST derivation from SUPABASE_URL in `src/db/index.ts` (extract project ref, build `db.<ref>.supabase.co`)
- [x] 1.2 Change default Supabase port to 6543 (PgBouncer pooling) in `getPgDb()`
- [x] 1.3 Add descriptive error logging around the `postgres()` connection so empty `SupabaseError:` messages include connection details
- [x] 1.4 Add graceful fallback: if connection fails, log a clear error and return empty/error results instead of crashing

## 2. Create production DB initialization

- [x] 2.1 Create `src/db/init.ts` that runs `CREATE TABLE IF NOT EXISTS` for all PG schema tables (users, roles, user_roles, contratos, encuestas, preguntas, surveyAnswers, surveySubmissions) using Postgres.js raw SQL
- [x] 2.2 Add seed logic to init.ts: insert roles (admin, general, nave) if missing
- [x] 2.3 Add seed logic to init.ts: insert initial users (cmarchena77, voluntariado, mercado) with Microsoft IDs and role assignments if missing, using idempotent INSERT ... ON CONFLICT
- [x] 2.4 Add `getPgDb()` initialization call inside init.ts to ensure the connection is established before seeding
- [x] 2.5 Call init at startup in `src/index.ts` when NODE_ENV === "production" (after server starts listening, or during bootstrap)

## 3. Verify end-to-end

- [x] 3.1 Run `pnpm run dev:supa` and confirm server starts without SupabaseError on first request
- [x] 3.2 Confirm tables and seed data exist by querying Supabase dashboard or via API
- [x] 3.3 Test login flow: POST /api/auth/login with Azure AD token, confirm 200 and JWT returned
- [x] 3.4 Test contract CRUD: GET /api/contracts with valid JWT, confirm 200 and empty array
- [x] 3.5 Test survey endpoint: GET /api/surveys, confirm 200
- [x] 3.6 Add a health check endpoint or extend existing one to report Supabase connection status

## 4. Cleanup and documentation

- [x] 4.1 Update `.env.example` with SUPABASE_DB_HOST, SUPABASE_DB_PORT, SUPABASE_DB_NAME, SUPABASE_DB_USER, SUPABASE_DB_PASSWORD comments
- [x] 4.2 Verify typecheck passes: `pnpm run typecheck`
- [x] 4.3 Verify tests still pass: `pnpm test`
