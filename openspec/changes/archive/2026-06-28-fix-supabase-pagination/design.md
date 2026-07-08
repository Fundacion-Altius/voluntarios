## Context

The production environment (Supabase/Postgres) uses `@supabase/supabase-js` REST client for contract data access. The `getPaginated` method fetches all rows and performs filtering, sorting, and pagination in JavaScript memory:

```
Express → supabase-js → PostgREST API (HTTP) → Postgres
                              ↓
                     Returns ALL rows (no .range(), .order())
                              ↓
                     JS .filter() + .sort() + .slice()
```

Staging (MariaDB) uses Drizzle ORM with proper SQL `LIMIT/OFFSET`/`ORDER BY`/`WHERE` — only the requested page of data crosses the network.

The project already has `getPgDb()` in `src/db/index.ts` that returns a Drizzle ORM instance with the PG schema connected directly to Postgres via `postgres.js` (TCP). This was set up previously but never used for contract queries.

## Goals / Non-Goals

**Goals:**
- Make `getPaginated` in production filter, sort, and paginate server-side
- Transfer only the requested page (~20 rows) instead of the full dataset (~300 rows and growing)
- Match the MariaDB repository pattern for consistency
- Keep the API response shape (`PaginatedResult<T>`) identical

**Non-Goals:**
- Changing the API contract or frontend data fetching logic
- Replacing the Supabase client entirely (still used for surveys, questions, answers, submissions)
- Cursor-based pagination (offset is fine for <10K rows in an admin dashboard)
- Frontend caching library (React Query/SWR) — defer to future change

## Decisions

### Decision 1: Drizzle ORM + direct Postgres over fixing Supabase-js client

| Option | Approach | Rationale |
|---|---|---|
| **Chosen: Drizzle ORM** | Use `getPgDb()` from `db/index.ts` | Direct TCP, no HTTP overhead, matches MariaDB pattern exactly, leverages existing code |
| Alternative: Fix supabase-js | Add `.range()`, `.order()`, `.contains()` to existing query | Smaller change, but still goes through PostgREST HTTP layer; area filtering on JSONB is more awkward |

The `getPgDb()` function is already wired for production (port 6543, SSL required). The MariaDB repo already demonstrates the exact Drizzle pattern we need — the PG version will be almost identical, just with `pgTable` column references and `@>` JSONB operators instead of `JSON_CONTAINS`.

### Decision 2: Offset pagination over cursor pagination

At ~300 rows (and likely well under 10K for this app), offset pagination with `LIMIT/OFFSET` is the right choice. It supports direct page navigation (page 1, 2, 3...) which the UI requires. Cursor pagination would prevent "jump to page N" in the DataTable.

### Decision 3: Extract a shared Drizzle contract repository function

Rather than modifying `supabaseRepository.ts`, create a new `pgContractRepository.ts` (or similar) that uses `getPgDb()`. This keeps the Supabase client file for other repos (surveys, questions, etc.) and makes the contract repo self-contained.

### Architecture after change

```
Production data flow:
  Request → contractController
              → pgContractRepository.getPaginated()
                  → getPgDb() (Drizzle ORM + postgres.js TCP)
                      → SELECT * FROM contratos
                        WHERE ... ORDER BY ...
                        LIMIT ? OFFSET ?
              ← { data[20], total, page, pageSize, totalPages }

Other entities (surveys, questions, answers, submissions):
  Still use existing supabaseRepository.ts with @supabase/supabase-js
```

## Risks / Trade-offs

- **[Connection failure]** The `postgres.js` connection could fail if Supabase credentials/SSL config changes. → `getPgDb()` already has error handling and logs connection failures; the controller catches and returns 500.
- **[IPv6 requirement]** Direct Supabase Postgres connection requires IPv6. Render may not support IPv6. → If the direct connection fails, fall back to fixing the supabase-js client (Option A) instead. Verify Render's IPv6 support during implementation.
- **[Cold starts]** On Render free tier, the Express instance may cold-start. The direct TCP connection adds a connection attempt during startup. → `getPgDb()` is lazy (initialized on first call), so it won't block boot. 
- **[Two code paths for Postgres]** Having both supabase-js and postgres.js clients adds complexity. → Acceptable trade-off for now; future work could migrate all repos to Drizzle ORM.
