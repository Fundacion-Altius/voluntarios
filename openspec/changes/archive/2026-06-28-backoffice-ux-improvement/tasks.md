## 1. Foundation — Sidebar Layout + Route Structure

- [x] 1.1 Create `(admin)` route group directory with `layout.tsx` containing auth guard, top bar, and sidebar wrapper
- [x] 1.2 Build sidebar component with three states: open (~240px), icon-only (~64px), hidden (mobile overlay)
- [x] 1.3 Implement drag-to-collapse on desktop (mousedown on edge, drag threshold, snap to icon-only)
- [x] 1.4 Implement responsive behavior: open by default desktop, hidden + hamburger on mobile
- [x] 1.5 Create placeholder `/dashboard` page at `(admin)/dashboard/page.tsx`
- [x] 1.6 Move existing contracts table to `(admin)/contratos/page.tsx`
- [x] 1.7 Add redirect from old `/dashboard` to `/contratos`
- [x] 1.8 Delete old `app/dashboard/layout.tsx` and `app/dashboard/page.tsx`
- [x] 1.9 Add sidebar navigation items with icons and active route highlighting
- [x] 1.10 Add keyboard accessibility and ARIA attributes to sidebar

## 2. User Management Page

- [x] 2.1 Create `/usuarios` page with DataTable, columns: Name, Email, Role, Created, Last Login, Actions
- [x] 2.2 Add search filtering by name/email
- [x] 2.3 Build "Nuevo Usuario" modal with form (name, email, role)
- [x] 2.4 Build edit user modal with pre-filled fields
- [x] 2.5 Build delete user confirmation dialog
- [x] 2.6 Wire up CRUD operations to `/api/users` backend endpoints
- [x] 2.7 Add error handling and success feedback for user operations

## 3. Survey Management Page

- [x] 3.1 Create `/encuestas` page with survey list
- [x] 3.2 Build "Nueva Encuesta" form (title + question selection)
- [x] 3.3 Implement survey results view showing aggregated ratings per question
- [x] 3.4 Implement `getReport()` in `pgSurveyRepository.ts` — query survey_answers + survey_submissions for aggregated data
- [x] 3.5 Wire up survey CRUD and report to backend endpoints

## 4. Dashboard KPIs — Backend

- [x] 4.1 Create `dashboardController.ts` with `GET /api/dashboard/stats` handler
- [x] 4.2 Implement total contracts and active volunteers aggregation
- [x] 4.3 Implement contracts by month aggregation (group by fecha)
- [x] 4.4 Implement contracts by lugar aggregation
- [x] 4.5 Implement corporate vs independent split (empresa present vs null/empty)
- [x] 4.6 Implement survey completion rate (submissions / contracts)
- [x] 4.7 Implement recent contracts (last 5)
- [x] 4.8 Register route in `src/api/routes/index.ts` with auth and admin middleware

## 5. Dashboard KPIs — Frontend

- [x] 5.1 Install and configure recharts dependency
- [x] 5.2 Build metric cards component (total contracts, active volunteers, survey rate)
- [x] 5.3 Build line chart component for contracts by month
- [x] 5.4 Build bar chart component for contracts by lugar
- [x] 5.5 Build pie chart component for corporate vs independent
- [x] 5.6 Build recent contracts widget (last 5)
- [x] 5.7 Wire up `/dashboard` page to fetch from `GET /api/dashboard/stats`
- [x] 5.8 Add loading skeleton state and error handling
