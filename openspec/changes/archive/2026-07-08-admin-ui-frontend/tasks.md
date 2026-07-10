## 1. Foundation — Sidebar Layout + Route Structure

- [x] 1.1 Add shadcn Sheet component as dependency for mobile sidebar (`pnpx shadcn@latest add sheet`)
- [x] 1.2 Create `app/admin/` directory with `layout.tsx` containing auth guard, top bar, and sidebar wrapper
- [x] 1.3 Build `Sidebar` component with three states: open (~240px), icon-only (~64px), hidden (mobile overlay)
- [x] 1.4 Implement drag-to-collapse on desktop (mousedown/touchstart on right edge, threshold snap to icon-only)
- [x] 1.5 Implement responsive behavior: open by default on desktop, hidden + hamburger on mobile via Sheet
- [x] 1.6 Build sidebar navigation items with icons and active route highlighting (next/navigation usePathname)
- [x] 1.7 Add keyboard accessibility and ARIA attributes to sidebar
- [x] 1.8 Move existing contracts table page from `app/dashboard/page.tsx` to `app/admin/contratos/page.tsx`
- [x] 1.9 Create placeholder `app/admin/dashboard/page.tsx` with loading skeleton (KPIs coming in Phase 4)
- [x] 1.10 Create `app/admin/usuarios/page.tsx` and `app/admin/encuestas/page.tsx` as stubs
- [x] 1.11 Update login redirects (`/contratos` → `/admin/contratos`), update sidebar links to `/admin/*`
- [x] 1.12 Delete old `app/dashboard/layout.tsx` and `app/dashboard/page.tsx`
- [x] 1.13 Implement non-admin role handling: if user role !== "admin", render top-bar-only layout (no sidebar)
- [x] 1.14 Create `TopBar` reusable component extracted from old dashboard layout
- [x] 1.15 Run lint and typecheck to verify foundation

## 2. User Management Page

- [x] 2.1 Create `app/admin/usuarios/page.tsx` with table: Name, Email, Role, Created At, Last Login, Actions
- [x] 2.2 Add search filtering by name/email with debounce
- [x] 2.3 Build "Nuevo Usuario" modal (shadcn Dialog) with form fields: name, email, role select
- [x] 2.4 Build edit user modal with pre-filled fields and role update
- [x] 2.5 Build delete user confirmation dialog (shadcn AlertDialog)
- [x] 2.6 Wire up CRUD operations to `/api/users` backend endpoints
- [x] 2.7 Add error handling and success feedback (inline messages)

## 3. Survey Management Page

- [x] 3.1 Create `app/admin/encuestas/page.tsx` with survey list/table: title, creation date, status
- [x] 3.2 Build "Nueva Encuesta" modal with title input, departamento, duración
- [x] 3.3 Build survey results view showing aggregated ratings per question (fetched from `/api/surveys/get-report`)
- [x] 3.4 Wire up survey CRUD and report to backend endpoints

## 4. Dashboard KPIs — Frontend

- [x] 4.1 Install recharts dependency (`pnpm add recharts`)
- [x] 4.2 Create `useDashboardStats` hook fetching from `GET /api/dashboard/stats`
- [x] 4.3 Build metric cards component (total contracts, active volunteers, survey completion rate)
- [x] 4.4 Build line chart component for contracts by month (recharts LineChart)
- [x] 4.5 Build bar chart component for contracts by lugar (recharts BarChart)
- [x] 4.6 Build pie/donut chart component for corporate vs independent (recharts PieChart)
- [x] 4.7 Build recent contracts widget (last 5, with name/empresa/fecha)
- [x] 4.8 Assemble `app/admin/dashboard/page.tsx` with all widgets and loading skeleton
- [x] 4.9 Add error handling for dashboard data fetch

## 5. Verification

- [x] 5.1 Run `pnpm run lint` on voluntarios-front
- [x] 5.2 Run `pnpm run typecheck` on voluntarios-front
- [x] 5.3 Run existing tests (`pnpm test`) to ensure no regressions
