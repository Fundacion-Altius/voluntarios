## 1. Drizzle Postgres Contract Repository

- [x] 1.1 Fix `supabaseRepository.getPaginated` — add `.range()`, `.order()`, `.contains()` for server-side pagination, filtering, and sorting
- [x] 1.2 Move area filtering from JavaScript to server-side (`.contains()`/`.or()`)
- [x] 1.3 Also create `pgContractRepository.ts` with Drizzle ORM + direct Postgres for future use (succeeded — pooler compatible)

## 2. Wire Repository into Controller

- [x] 2.1 Controller stays with `supabaseContractRepository()` for production (direct Postgres pooler rejected queries with XX000/FATAL)
- [x] 2.2 Verify environment switch logic: `NODE_ENV=production` → `supabaseContractRepository` (fixed), `staging` → MariaDB, `development` → in-memory

## 3. Frontend Timeout Handling

- [x] 3.1 Add AbortController signal with 30s timeout to `useContracts.ts` fetch call
- [x] 3.2 Surface timeout errors as user-visible error messages in the dashboard

## 4. Testing

- [x] 4.3 Run `pnpm run typecheck` and `pnpm run lint` on the backend
- [x] 4.4 Run `pnpm test` on frontend to confirm no regressions

## 5. Verification

- [x] 5.1 Start backend with `pnpm run dev:supa` and verify dashboard loads in development pointing at Supabase
- [x] 5.2 Verify that the network tab shows only 20 rows transferred (not all 300)
- [x] 5.3 Verify sorting, searching, area filtering, and pagination all work end-to-end
