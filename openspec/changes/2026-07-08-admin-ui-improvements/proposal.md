## Why

The admin dashboard charts currently use monochrome/black-and-white colors that are indistinguishable in both light and dark mode, making the KPI visualization ineffective. The shadcn button also lacks a `cursor: pointer` on hover, which is a standard UX affordance users expect. Additionally, there are uncommitted changes in `voluntarios-front` that need to be committed and branched properly before further work.

The survey submission endpoint (`POST /api/surveys/submit-answer`) is intended to be public/anonymous but returns 403 because the global CSRF middleware blocks it — the endpoint is not exempt from CSRF validation, and the public survey form does not send a CSRF token.

## What Changes

- Stage and commit all pending changes in `voluntarios-front/`
- Create a new feature branch from `dev` following conventional commits naming (e.g., `feat/admin-ui-improvements`)
- Add `cursor: pointer` to the shadcn Button component's default hover state
- Replace monochrome chart colors with a theme-aware palette that works in both light and dark mode across the three dashboard charts (ContractsByMonthChart, CorporateVsIndependentChart, ContractsByLugarChart)
- Add `/api/surveys/submit-answer` to the CSRF exemption list so the public survey form can submit without a CSRF token
- Convert `e2e/survey-flow.spec.ts` from mocked API tests to real E2E tests hitting the actual backend, verifying the CSRF exemption works end-to-end

## Capabilities

### New Capabilities
<!-- None — this is a UI polish/fix, no new capabilities introduced -->

### Modified Capabilities
- `admin-dashboard-page`: Chart color requirements updated to specify theme-aware colors (light/dark mode compatible) instead of monochrome/primary-only
- `survey-submission`: CSRF exemption added for submit-answer endpoint to ensure anonymous submissions work

## Impact

- `voluntarios-front/src/components/ui/button.tsx` — add `cursor: pointer` to base styles
- `voluntarios-front/src/app/admin/dashboard/components/ContractsByMonthChart.tsx` — update line stroke color
- `voluntarios-front/src/app/admin/dashboard/components/CorporateVsIndependentChart.tsx` — update pie cell colors
- `voluntarios-front/src/app/admin/dashboard/components/ContractsByLugarChart.tsx` — update bar fill color
- Git: new branch from `dev`, commit staged frontend changes
- `voluntarios-back/src/utils/csrfUtils.ts` — add `/api/surveys/submit-answer` to `CSRF_EXEMPT_PATHS`
- `voluntarios-front/e2e/survey-flow.spec.ts` — rewrite as real E2E tests (remove `page.route()` mocks, exercise real backend)
