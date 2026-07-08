## Context

The backend starts successfully in production mode (`pnpm run dev:supa`) but all API calls fail. Logs show:

- `SupabaseError:` with empty message — Postgres.js connection to Supabase fails silently
- `User not found by email / Microsoft ID` — no tables exist in Supabase DB
- All requests return 401/403 because auth middleware can't find users

The `.env` file has `SUPABASE_URL` and `SUPABASE_KEY` (for `@supabase/supabase-js` RPC calls) but is **missing** `SUPABASE_DB_HOST`, `SUPABASE_DB_PORT`, `SUPABASE_DB_NAME`, `SUPABASE_DB_USER`, `SUPABASE_DB_PASSWORD` — which Postgres.js (`getPgDb()`) needs for direct Drizzle queries.

The Supabase project at `blbjhfzsgyxanjtmnbdy.supabase.co` exists but has no tables created.

## Goals / Non-Goals

**Goals:**
- Fix Postgres.js connection to Supabase so Drizzle queries succeed
- Create all required PG tables in Supabase (users, roles, user_roles, contratos, encuestas, preguntas, surveyAnswers, surveySubmissions)
- Seed initial users (cmarchena77, voluntariado, mercado) with correct roles
- Verify end-to-end: login → contract CRUD → survey queries work
- Surface clear error messages when connection fails

**Non-Goals:**
- No changes to the MariaDB or in-memory backends
- No changes to the frontend code
- No CI/CD pipeline changes
- No migration to Supabase Auth (stays on custom JWT + Azure AD)

## Decisions

### 1. Derive Postgres connection from Supabase URL
Instead of requiring 5 separate env vars, derive `SUPABASE_DB_HOST` from `SUPABASE_URL` automatically. The standard pattern is `db.<project-ref>.supabase.co`. Add a fallback in code so that if `SUPABASE_DB_HOST` is not set, it's inferred from `SUPABASE_URL`.

### 2. Add startup DB initialization for production
Create `src/db/init.ts` that runs on startup when `NODE_ENV=production`. It uses Drizzle's `migrate` or raw SQL via the Supabase client to:
- Create tables if they don't exist
- Seed roles (admin, general, nave)
- Seed users with Microsoft IDs
- **Why not raw SQL?** Using Drizzle's `push` schema or the Supabase management API is cleaner. But for simplicity and reliability, we'll use raw SQL via the Supabase client's `.rpc()` or postgres.js directly with `CREATE TABLE IF NOT EXISTS`.

### 3. Connection pooling port
Supabase offers port 6543 for connection pooling (PgBouncer). Use port 6543 by default for production to avoid connection limits. Keep 5432 as fallback.

### 4. Better error logging
Wrap the `getPgDb()` connection attempts with descriptive error messages. Replace the silent `SupabaseError:` with specific messages: "Connection refused", "Authentication failed", "SSL handshake failed".

## Risks / Trade-offs

- [**Credential exposure**] → `.env` already has `SUPABASE_KEY`. We need `SUPABASE_DB_PASSWORD` — add a strong password and keep it in `.env` only (not committed).
- [**Schema drift**] → Running `CREATE TABLE IF NOT EXISTS` on every startup means schema changes require manual migration. Trade-off accepted for now — this is a v1 fix.
- [**Connection timeout**] → If Supabase is unreachable, the app hangs. Set a short `connect_timeout` (already 2s, good) and fail fast with a clear message.
