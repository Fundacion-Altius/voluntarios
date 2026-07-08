## Context

The dashboard loads all contracts from `GET /api/contracts` and renders them in a simple `Table` component with no pagination, sorting, or search. With 250+ contracts, this is unusable. The backend returns the full list; all filtering is client-side via role-based `getAllFilteredByRole()`. The UI uses `@/components/ui/table` (raw shadcn Table primitives).

The user wants a shadcn-style DataTable (`@tanstack/react-table`) with pagination, column sorting, and a debounced search bar — matching patterns from the shadcn DataTable examples.

## Goals / Non-Goals

**Goals:**
- Backend `GET /api/contracts` accepts `?page=&pageSize=&sortBy=&sortOrder=&search=` query params
- `IRepository<T>` gains a `getPaginated()` method returning `{ data, total, page, pageSize, totalPages }`
- All 3 repos (in-memory, MariaDB, Supabase) implement server-side pagination, sorting, and search
- Frontend Dashboard sends query params and renders a shadcn DataTable
- DataTable has sortable column headers (click to toggle asc/desc), page navigation, page-size selector, and a search input with 300ms debounce
- Role-based filtering (`admin` sees all, `nave` sees only Nave, `general` excludes Nave) remains applied server-side
- Existing `GET /api/contracts/:id`, `POST`, `PUT`, `DELETE` unchanged

**Non-Goals:**
- No row selection or bulk actions in this change
- No CSV export
- No changes to the contract wizard or its components

## Decisions

1. **Server-side pagination** over client-side — 250 contracts now, likely to grow. Server-side avoids shipping the full dataset on every request and keeps sorting/search deterministic.
2. **New `getPaginated()` method on `IRepository`** — keeps the existing `getAll()` and `getAllFilteredByRole()` intact. Adding params to existing methods would break callers and make the interface harder to reason about. The new method returns a `PaginatedResult<T>` type (`{ data: T[], total: number, page: number, pageSize: number, totalPages: number }`).
3. **Query param names**: `page` (1-indexed), `pageSize` (default 20), `sortBy` (column name from the DB schema), `sortOrder` (`asc` | `desc`), `search` (text searched across nombre, email, areas). Matches common REST conventions.
4. **Search field**: searches across `nombre`, `email`, and `areas` using `LIKE` / `ilike` on SQL backends; in-memory uses `Array.filter` + `String.includes`. Case-insensitive everywhere.
5. **Debounce on the client** (300ms) — the input updates a local state, which triggers a `useEffect` that waits 300ms before calling the API. Avoids spamming the server on every keystroke.
6. **shadcn DataTable pattern** — build a reusable `DataTable<T>` component using `@tanstack/react-table` following the official shadcn example. Column definitions live in a `columns.tsx` file co-located with the table. Sorting state and pagination state are managed via `@tanstack/react-table`'s controlled mode.
7. **Sync pagination with table state** — `react-table` controls the client-side paging UI; on page change / sort change / search, the component calls the API with updated params. The table is fully controlled (manual pagination + manual sorting).

## Risks / Trade-offs

- [Risk] Backward compatibility: existing API consumers (tests, future scripts) that call `GET /api/contracts` without pagination params. → Mitigation: default values (`page=1`, `pageSize=250`) and a `legacy` mode: if no pagination params are sent, return the full list as before. Actually simpler: always return paginated response `{ data, total, page, pageSize, totalPages }`; the old response was a plain array. This is a **breaking change** for any consumer expecting a raw array. → Mitigation: only the dashboard uses this endpoint; no external consumers. Accept the minor breaking shape change.
- [Risk] Sorting column names must match DB column names. → Mitigation: whitelist allowed `sortBy` values on the backend to prevent SQL injection / column injection.
- [Risk] Supabase text search performance on large datasets. → Mitigation: for now, use `ilike` search; add a full-text search index later if needed.
- [Risk] Debounce delay makes search feel laggy. → Mitigation: 300ms is standard; show a "Searching..." indicator if the API call takes noticeable time.
