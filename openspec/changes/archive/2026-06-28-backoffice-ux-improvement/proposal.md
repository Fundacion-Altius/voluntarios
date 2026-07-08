## Why

The admin backoffice currently has a single `/dashboard` page with only a contracts table, no navigation between admin sections, and no aggregated view of the system's data. As the platform grows (contracts, users, surveys), admins need a proper backoffice with navigation and actionable KPIs.

## What Changes

- **BREAKING**: Current `/dashboard` contracts table moves to `/contratos`
- **NEW**: `/dashboard` becomes a KPI dashboard with charts and metrics
- **NEW**: `/usuarios` page with DataTable + add/edit/remove user flow
- **NEW**: `/encuestas` admin page for survey management and results
- **NEW**: Shared admin layout with responsive left sidebar (open by default desktop, collapsible via drag, burger icon on mobile)
- **NEW**: Backend aggregation endpoint(s) to feed dashboard KPIs
- **NEW**: PG implementation of `surveyRepo.getReport()` for survey results

## Capabilities

### New Capabilities
- `admin-layout`: Shared responsive sidebar layout for admin pages, drag-to-collapse, mobile overlay, route group under `(admin)`
- `admin-contracts-page`: Contracts listing with filters, search, pagination at `/contratos`
- `admin-users-page`: User management CRUD with DataTable at `/usuarios`
- `admin-surveys-page`: Survey CRUD + question management + results view at `/encuestas`
- `admin-dashboard-page`: KPI dashboard with recharts, metrics cards at `/dashboard`
- `dashboard-stats-api`: Backend aggregation endpoints for dashboard data

### Modified Capabilities
- *(none — all are new capabilities)*

## Impact

- **Frontend**: New `(admin)` route group, sidebar component, recharts dependency, `/contratos`, `/usuarios`, `/encuestas`, `/dashboard` pages. Existing `/dashboard/layout.tsx` and `/dashboard/page.tsx` removed.
- **Backend**: New `GET /api/dashboard/stats` aggregation endpoint. PG implementation of `surveyRepo.getReport()`.
- **Dependencies**: recharts library added to frontend.
