## Context

The admin backoffice has a single `/dashboard` route with a top navbar and a contracts table. Users (admins) have no way to navigate between different admin sections. There are no aggregated metrics or KPIs visible. The frontend uses Next.js 14 App Router with shadcn UI components. The backend has CRUD endpoints for contracts, users, and surveys but no aggregation endpoints.

## Goals / Non-Goals

**Goals:**
- Provide a responsive left sidebar with navigation to Contratos, Usuarios, Encuestas, and Dashboard
- Move existing contracts table from `/dashboard` to `/contratos`
- Build a KPI dashboard at `/dashboard` with recharts visualizations
- Add user management page at `/usuarios` with DataTable + add/edit/remove
- Add survey management page at `/encuestas` with listing and results
- Create backend aggregation endpoint(s) for dashboard data
- Implement PG `surveyRepo.getReport()` for survey results

**Non-Goals:**
- Changing the public-facing pages (contract wizard, survey form, legal pages)
- Altering authentication or authorization logic
- Refactoring existing backend CRUD endpoints
- Adding real-time updates or WebSocket connections

## Decisions

### 1. Route Structure: Route Group + Flat Routes
Use a Next.js route group `(admin)` to share a single layout across all admin pages. Routes stay flat without a prefix.

```
src/app/(admin)/layout.tsx       → sidebar + top bar + auth guard
src/app/(admin)/dashboard/page.tsx   → /dashboard
src/app/(admin)/contratos/page.tsx   → /contratos
src/app/(admin)/usuarios/page.tsx    → /usuarios
src/app/(admin)/encuestas/page.tsx   → /encuestas
```

**Rationale:** Route groups prevent adding an extra segment to URLs. Flat routes are cleaner than `/admin/...` prefix. The existing `/dashboard/layout.tsx` and `/dashboard/page.tsx` are deleted; their auth guard and top bar logic move into the new layout.

### 2. Sidebar: Drag-to-Collapse with Three States
The sidebar supports three visual states:

| State | Width | Desktop Trigger | Mobile Trigger |
|-------|-------|-----------------|----------------|
| **Open** | ~240px | Default on load | Hidden (burger to open/close) |
| **Icons** | ~64px | Drag edge past threshold | N/A |
| **Hidden** | 0 / overlay | N/A | Default on load, slides over content |

The drag mechanism uses `mousedown` on the right edge of the sidebar. A visual drag handle appears on hover. When the user drags past a threshold (~80px), the sidebar snaps to icon-only mode. Resizing is continuous (no snap points other than the icon collapse threshold).

**Responsive behavior:**
- **Desktop (>768px):** Open by default, collapsible via drag
- **Mobile (<768px):** Hidden by default, opened via hamburger button in top bar. Slides as an overlay over content. Close on backdrop click or route navigation.

**Rationale:** Drag-to-collapse is more tactile and discoverable than a toggle button. Icon-only mode conserves screen space while keeping navigation accessible. Mobile overlay is the standard mobile navigation pattern.

### 3. Top Bar: Kept from Current Dashboard Layout
The existing top bar (logo, theme toggle, user name/email, logout button) remains visually similar but moves from `/dashboard/layout.tsx` to `(admin)/layout.tsx`. On mobile, a hamburger icon appears in the top bar to toggle the sidebar.

**Rationale:** Familiarity — admins already see this UI. No need to redesign something that works.

### 4. Dashboard API: Single Aggregation Endpoint
One new backend endpoint:

```http
GET /api/dashboard/stats
Authorization: Bearer <token>
```

Response:
```json
{
  "totalContracts": 142,
  "activeVolunteers": 98,
  "surveyCompletionRate": 0.67,
  "contractsByMonth": [
    { "month": "2026-01", "count": 12 },
    { "month": "2026-02", "count": 18 }
  ],
  "contractsByLugar": [
    { "lugar": "Madrid", "count": 60 },
    { "lugar": "Barcelona", "count": 40 }
  ],
  "corporateVsIndependent": {
    "corporate": 85,
    "independent": 57
  },
  "recentContracts": [
    { "id": "abc", "nombre": "Ana...", "empresa": "...", "fecha": "..." }
  ]
}
```

**Rationale:** A single endpoint is simpler to implement, cache, and document vs multiple separate endpoints. The data volume is small enough that returning everything in one response is reasonable. This endpoint goes in a new `dashboardController.ts` within the existing controller pattern.

### 5. Dashboard Charts: recharts
Add `recharts` as a dependency. The dashboard uses:
- **Line chart:** Contracts by month (trend over time)
- **Bar chart:** Contracts by lugar
- **Pie chart:** Corporate vs independent volunteers
- **Metric cards:** Total contracts, active volunteers, survey completion rate (with colored badges/trend indicators)

**Rationale:** recharts is the most popular React charting library, works well with Next.js client components, and has good TypeScript support.

### 6. Data Fetching Strategy: React Query
All admin pages use `@tanstack/react-query` (already a dependency) for data fetching. Each page defines its own query key.

**Rationale:** Consistently with the existing frontend pattern. No new state management needed.

### 7. Survey Report: PG Implementation
The `pgSurveyRepository.ts` needs a `getReport()` method that queries the `survey_answers` and `survey_submissions` tables to produce aggregated rating data. The query joins submissions with answers and calculates average ratings per question.

**Rationale:** Currently returns `undefined` — this is broken functionality that needs to work for the admin survey page to show results.

### 8. Implementation Order
Phased approach within the same change:

1. **Phase 1 — Foundation:** Sidebar component + route group + move contracts table to `/contratos` + placeholder `/dashboard`
2. **Phase 2 — User Management:** `/usuarios` page with DataTable + add/edit/remove
3. **Phase 3 — Survey Management:** `/encuestas` page + PG `getReport()` implementation
4. **Phase 4 — Dashboard KPIs:** Backend stats endpoint + `/dashboard` with recharts

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Drag-to-collapse sidebar has accessibility gaps (keyboard nav, screen readers) | Implement with ARIA attributes (`role="navigation"`, `aria-expanded`). Support toggle button alongside drag. |
| Dashboard stats endpoint may be slow if PG tables grow large | Add database indexes on `fecha`, `lugar`, `empresa`. Consider row-level caching (React Query stale time). |
| `/encuestas` route name conflicts with public `/encuesta` | Plural/singular distinction is sufficient. Add a comment in both route files noting the sibling. |
| Moving `/dashboard` content breaks bookmarks | Add a redirect from `/dashboard` (old contracts page) to `/contratos` during migration. |
| Phased delivery means some sidebar links exist before their pages are built | Sidebar links for incomplete pages are disabled or show a "coming soon" state. Only link to ready pages. |
