## Why

The admin backoffice UI was previously implemented but lost during branch/merge issues. Currently the admin area has only a `/dashboard` page showing a contracts table with no navigation between sections, no aggregated KPIs, and no sidebar. Admins need a proper backoffice with navigation and actionable metrics. The backend (`GET /api/dashboard/stats`, user/survey/contract endpoints) is already in place — only the frontend needs rebuilding.

## What Changes

- **NEW**: Shared admin layout with responsive left sidebar (open by default on desktop, collapsible via drag to icon-only mode, overlay on mobile with hamburger toggle)
- **NEW**: `(admin)` route group with flat routes: `/dashboard`, `/contratos`, `/usuarios`, `/encuestas`
- **BREAKING**: Current `/dashboard` contracts table moves to `/contratos`
- **NEW**: `/dashboard` becomes a KPI dashboard with metric cards, line/bar/pie charts (recharts) and recent contracts widget
- **NEW**: `/usuarios` page with DataTable + add/edit/remove user flow
- **NEW**: `/encuestas` admin page for survey management and results
- **MODIFIED**: `/dashboard/layout.tsx` replaced by `(admin)/layout.tsx` with sidebar + top bar; old `/dashboard/page.tsx` moves to `/contratos`
- **MODIFIED**: Sidebar, dashboard charts, and admin pages are restricted to `admin` role only; other roles (nave, general) keep the existing top-bar-only layout and contract table view

## Capabilities

### New Capabilities
- `admin-layout`: Shared responsive sidebar layout for admin pages, drag-to-collapse, mobile overlay, route group under `(admin)` — spec already exists in `openspec/specs/admin-layout`
- `admin-contracts-page`: Contracts listing with filters, search, pagination at `/contratos` — spec already exists in `openspec/specs/admin-contracts-page`
- `admin-users-page`: User management CRUD with DataTable at `/usuarios` — spec already exists in `openspec/specs/admin-users-page`
- `admin-surveys-page`: Survey CRUD + question management + results view at `/encuestas` — spec already exists in `openspec/specs/admin-surveys-page`
- `admin-dashboard-page`: KPI dashboard with recharts, metrics cards at `/dashboard` — spec already exists in `openspec/specs/admin-dashboard-page`

### Modified Capabilities
- *(none — all admin-specific pages are new; existing dashboard-datatable and dashboard-stats-api specs are unaffected in requirements)*

## Impact

- **Frontend**: New `(admin)` route group, sidebar component, recharts dependency, `/contratos`, `/usuarios`, `/encuestas`, `/dashboard` pages. Existing `/dashboard/layout.tsx` and `/dashboard/page.tsx` replaced. Non-admin roles retain access to contracts table (moved to `/contratos`) via a simpler layout without the admin sidebar.
- **Backend**: No new endpoints needed — `GET /api/dashboard/stats`, `/api/contracts`, `/api/users`, `/api/surveys` already exist.
- **Dependencies**: recharts added to frontend package.json. shadcn `Sheet` component may be added if used instead of custom drawer.
