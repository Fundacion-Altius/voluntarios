## 1. Backend - Types and IRepository

- [x] 1.1 Add `PaginatedParams` and `PaginatedResult<T>` types to `src/entities/types.ts`
- [x] 1.2 Add `getPaginated(params: PaginatedParams)` method to `IRepository<T>` in `src/entities/Repository.ts`

## 2. Backend - In-memory repository

- [x] 2.1 Implement `getPaginated` in `inMemoryContractRepository` with filtering, sorting, and pagination

## 3. Backend - MariaDB repository

- [x] 3.1 Implement `getPaginated` in `mariaDBContractRepository` with SQL WHERE/ORDER BY/LIMIT/OFFSET for pagination, sorting, and `LIKE` search

## 4. Backend - Supabase repository

- [x] 4.1 Implement `getPaginated` in `supabaseContractRepository` using Supabase JS SDK query builder (`.range()`, `.order()`, `.ilike()`)

## 5. Backend - Controller and routes

- [x] 5.1 Update `contractController.ts` — parse `page`, `pageSize`, `sortBy`, `sortOrder`, `search` from `req.query`; call `getPaginated`; return paginated response shape
- [x] 5.2 Add whitelist validation for `sortBy` values; return 400 for invalid columns
- [x] 5.3 Preserve role-based filtering in paginated flow (`admin`/`nave`/`general`)

## 6. Frontend - Dependencies and component scaffold

- [x] 6.1 Install `@tanstack/react-table`
- [x] 6.2 Build reusable `DataTable<T>` component at `src/components/ui/data-table.tsx` with sortable headers, pagination controls, and loading state (matching shadcn pattern)

## 7. Frontend - Column definitions

- [x] 7.1 Create `src/app/dashboard/columns.tsx` with column definitions for Nombre, Email, Áreas, Fecha, PDF actions — each sortable column wired to the `sortBy`/`sortOrder` API params

## 8. Frontend - Dashboard data fetching

- [x] 8.1 Create a custom hook `useContracts` (or inline in dashboard) that manages `page`, `pageSize`, `sortBy`, `sortOrder`, `search` state and fetches from `GET /api/contracts` with those params
- [x] 8.2 Implement 300ms debounce on the search input

## 9. Frontend - Dashboard integration

- [x] 9.1 Update `src/app/dashboard/page.tsx` to use the new `DataTable` + column definitions + paginated fetch hook
- [x] 9.2 Add search input above the table, pagination controls below
- [x] 9.3 Add `wrapper` class for horizontal scroll on narrow screens
- [x] 9.4 Build a `Skeleton` shadcn component (`src/components/ui/skeleton.tsx`) for animated pulse placeholders
- [x] 9.5 Replace the plain "Loading..." auth check with a full-page skeleton matching the dashboard layout
- [x] 9.6 Show table-body skeleton rows during data fetches (initial load, pagination, sorting, search)
- [x] 9.7 Handle empty and error states

## 10. Backend tests

- [x] 10.1 Update existing `contractApi.spec.ts` to test paginated response shape

## 11. Verify

- [x] 11.1 Run `pnpm run typecheck` on both backend and frontend
- [x] 11.2 Run `pnpm test` on backend (all 123 tests pass)
- [x] 11.3 Run `pnpm test` on frontend (Jest + Playwright)
- [x] 11.4 Run `pnpm run lint` on both packages
