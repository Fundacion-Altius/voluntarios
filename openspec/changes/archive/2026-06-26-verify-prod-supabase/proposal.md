## Why

The app fails to work when running with `NODE_ENV=production` (Supabase backend). Backend starts but all API calls return 403 or 401 because: (1) the Postgres.js connection to Supabase fails silently, (2) required PG tables (users, roles, contratos, etc.) don't exist in the Supabase database, and (3) users cannot be found/authenticated. This blocks deployment to production on Render.

## What Changes

- Diagnose and fix the Supabase/Postgres.js connection (SSL, credentials, connectivity)
- Create a database initialization script that creates all required PG tables on startup when in production mode
- Seed initial users and roles so authentication works
- Fix any silent failures to surface clear error messages
- Verify the full flow: login → contract CRUD → PDF generation works end-to-end

## Capabilities

### New Capabilities
- `prod-db-init`: Database initialization for Supabase/Postgres — creates tables and seeds users/roles on startup in production mode
- `prod-connection-fix`: Fix the Postgres.js connection to Supabase (SSL, env vars, connection pooling)
- `prod-verification`: Verification script/suite that confirms all endpoints work against the real Supabase instance

### Modified Capabilities
- `database-setup`: Extend to cover automated table creation in Supabase (not just SQL generation) plus user seeding

## Impact

- `voluntarios-back/src/infra/supabase/` — Supabase repositories may need connection fixes
- `voluntarios-back/src/db/index.ts` — Postgres.js connection config
- New init/seed script for production bootstrapping
- Frontend connects to `NEXT_PUBLIC_API_URL` (Render URL) — no frontend code changes expected
