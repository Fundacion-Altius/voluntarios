## Why

The dashboard currently loads all 250+ contracts at once with no pagination, sorting, or search, making it unusable for admins to find specific contracts. Adding a shadcn DataTable with pagination, column sorting, and a debounced search bar gives admins a fast, professional-grade tool to manage contracts.

## What Changes

- **Backend**: `GET /api/contracts` gains query params for pagination (`page`, `pageSize`), sorting (`sortBy`, `sortOrder`), and search (`search`). The `IRepository` interface gets a new method. All 3 repos (in-memory, MariaDB, Supabase) implement it.
- **Frontend**: Install `@tanstack/react-table`. Replace the simple `ContractTable` with a shadcn `DataTable` component featuring sortable column headers, pagination controls, and a debounced search input.
- **Dashboard**: Lift data fetching + query state out of `useEffect` into a controlled pattern that sends pagination/sort/search params to the API.

## Capabilities

### New Capabilities
- `contract-list-api`: Backend endpoint supporting pagination, sorting, and full-text search on `GET /api/contracts`
- `dashboard-datatable`: Frontend DataTable with pagination, column sorting, and debounced search

### Modified Capabilities
- *(none)*

## Impact

- **Backend**: `src/entities/Repository.ts` (`IRepository<T>` gets new `getPaginated()` method signature), `src/api/controllers/contractController.ts` (parse query params, call new repo method), all 3 infra repos, `src/api/routes/contractRoutes.ts` (no change needed — already `authMiddleware` on GET).
- **Frontend**: `package.json` (+ `@tanstack/react-table`), new `src/components/ui/data-table.tsx`, rewrite `src/app/components/ContractTable.tsx`, update `src/app/dashboard/page.tsx`.
- **Dependencies**: `@tanstack/react-table` added.
