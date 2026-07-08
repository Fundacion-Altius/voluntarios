## Context

The admin backoffice UI was previously developed but lost. The backend is fully ready (contracts CRUD, users CRUD, surveys CRUD, `GET /api/dashboard/stats` aggregation endpoint, auth/role middleware). The frontend currently has a bare `/dashboard` page showing only a contracts table with a top nav bar — no sidebar, no navigation between admin sections, no KPIs.

The design follows the specs already defined in `openspec/specs/` (admin-layout, admin-dashboard-page, admin-contracts-page, admin-users-page, admin-surveys-page). This document covers the implementation approach for rebuilding the frontend.

## Goals / Non-Goals

**Goals:**
- Build responsive left sidebar (drag-to-collapse, 3 states) for admin role only
- Create `(admin)` route group with shared layout
- Move contracts table from `/dashboard` to `/contratos`
- Build KPI dashboard at `/dashboard` with metric cards, recharts, recent contracts
- Build user management page at `/usuarios` with CRUD
- Build survey management page at `/encuestas` with list, create, results
- Restrict all admin UI to `admin` role — non-admin roles keep top-bar-only layout

**Non-Goals:**
- Changing the public-facing pages (contract wizard, survey form, legal pages)
- Altering authentication or authorization logic
- Refactoring existing backend CRUD endpoints
- Adding real-time updates or WebSocket connections

## Decisions

### 1. Route Structure: Route Group + Flat Routes
Use `(admin)` route group to share a single layout. Routes stay flat (no `/admin` prefix).

```
src/app/(admin)/layout.tsx       → sidebar + top bar + auth guard
src/app/(admin)/dashboard/page.tsx   → /dashboard
src/app/(admin)/contratos/page.tsx   → /contratos
src/app/(admin)/usuarios/page.tsx    → /usuarios
src/app/(admin)/encuestas/page.tsx   → /encuestas
```

Existing `/dashboard/layout.tsx` and `/dashboard/page.tsx` are deleted. Auth guard and top bar logic move into `(admin)/layout.tsx`. Add a redirect from old `/dashboard` to `/contratos` for backwards compatibility.

### 2. Sidebar: Drag-to-Collapse with Three States
| State | Width | Desktop | Mobile |
|-------|-------|---------|--------|
| **Open** | ~240px | Default on load | Hidden (burger to open) |
| **Icons** | ~64px | Drag edge past threshold | N/A |
| **Hidden** | 0 / overlay | N/A | Default, slides over content |

Drag uses `mousedown`/`touchstart` on the right edge. Threshold at ~80px remaining width snaps to icon-only. ARIA attributes (`role="navigation"`, `aria-expanded`). Keyboard accessible.

**Rationale:** Specs already define this behavior. Reuse the existing design from the archived change.

### 3. Non-Admin Role Handling
Non-admin roles (nave, general) should NOT see the sidebar. They keep a simpler layout:
- Option A: They share the `(admin)` route group but render a layout without sidebar
- Option B: They continue using a separate `/dashboard` layout (no route group)

**Decision:** Option A — check `user.role` in `(admin)/layout.tsx`. If role !== "admin", render children with the old top-bar-only layout. If role === "admin", render the full sidebar layout. This keeps a single route group and avoids duplication.

### 4. Dashboard Charts: recharts
recharts line/bar/pie charts for the dashboard. Three separate client components for each chart type. All use the `GET /api/dashboard/stats` endpoint (already built).

**Rationale:** Most popular React charting library, works with Next.js client components, good TypeScript support.

### 5. Data Fetching: React Query
Use `@tanstack/react-query` (already a dependency) for all admin page data fetching. Each page defines its own query key. SWR fallback if react-query is not preferred.

### 6. User CRUD: Modals + DataTable
Users page uses:
- `DataTable` for list (reuse pattern from contracts)
- Modal/dialog for create and edit (shadcn Dialog)
- Confirmation alert for delete (shadcn AlertDialog)

**Rationale:** Consistent with existing UI patterns. No need for separate form pages.

### 7. Survey Page: List + Create + Results
Surveys page has three views:
- List view: table with title, date, status, actions (Ver Resultados)
- Create view: modal with title + question multi-select
- Results view: rendered report from `GET /api/surveys/get-report`

### 8. Implementation Order (4 Phases)
1. **Foundation:** Sidebar component + route group + move contracts to `/contratos` + placeholder `/dashboard`
2. **User Management:** `/usuarios` page with DataTable + CRUD modals
3. **Survey Management:** `/encuestas` page with list, create, results
4. **Dashboard KPIs:** Install recharts, build metric cards + charts + recent contracts widget

### 9. Redirect for Backwards Compatibility
Old `/dashboard` (now the contracts table) redirects to `/contratos`. Implement via Next.js redirect in a route handler or middleware.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Drag-to-collapse sidebar has accessibility gaps | Implement with ARIA attributes. Support toggle button alongside drag. |
| `/encuestas` name conflicts with public `/encuesta` | Plural/singular distinction. Note in route files. |
| Moving `/dashboard` breaks bookmarks | Add redirect from `/dashboard` to `/contratos` during migration. |
| recharts adds bundle size | Tree-shakeable. Only import used chart types. |
