## Why

The dashboard data table stays stuck in a skeleton loading state in production (Supabase/Postgres) while staging (MariaDB) works fine. The production `getPaginated` method fetches all rows from the database and does filtering, sorting, and pagination in JavaScript, causing slow load times. With ~300 rows already in production, every page load transfers the entire dataset over HTTP and processes it in memory.

## What Changes

- Rewrite the Supabase contract repository's `getPaginated` to perform filtering, sorting, and pagination server-side (via Drizzle ORM + direct Postgres connection), matching the MariaDB repository pattern
- Move contract data access in production from `@supabase/supabase-js` REST client to Drizzle ORM with `postgres.js` direct TCP connection (already configured via `getPgDb()`)
- Update the controller's environment switch to use the new repository
- Add a request timeout and error boundary in the frontend `useContracts` hook
- No changes to the API contract — paginated response shape stays the same

## Capabilities

### New Capabilities

- `contracts-prod-data-access`: Server-side paginated, filterable, sortable contract queries for the production (Supabase/Postgres) environment, using Drizzle ORM over direct Postgres connection

### Modified Capabilities

None — no existing specs to modify.

## Impact

- `voluntarios-back/src/infra/supabase/supabaseRepository.ts` — rewrite `getPaginated` and `getAllFilteredByRole` to use Drizzle ORM + `getPgDb()`; remove Supabase client usage for contract operations
- `voluntarios-back/src/api/controllers/contractController.ts` — update production repository selection to use the new implementation
- `voluntarios-back/src/db/index.ts` — verify `getPgDb()` works correctly for querying contracts
- `voluntarios-front/src/app/dashboard/useContracts.ts` — add request timeout, error boundary improvements
- `voluntarios-back/src/entities/Repository.ts` — no changes needed (interface already supports `getPaginated`)

Archived: 2026-06-28
