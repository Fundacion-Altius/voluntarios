## Why

Currently the contract list page does not filter by user role. `general` users see all contracts including "Nave" area ones, while `nave` users should only see "Nave" area contracts, and `admin` users should see everything. Additionally, the contract creation form is not styled properly, making it hard to use.

## What Changes

- Add role-based filtering to the contracts list API endpoint: `general` excludes "Nave" area contracts, `nave` only shows "Nave" area contracts, `admin` sees all.
- Update the frontend dashboard to consume the filtered contracts list and display only the contracts the logged-in user is allowed to see.
- Properly style the contract creation form (layout, spacing, validation states, responsive behavior) using existing shadcn components.
- Add unit, integration, and E2E tests that cover role filtering and form styling.

## Capabilities

### New Capabilities
- `contract-role-filtering`: Backend and frontend logic to filter contracts by the logged-in user's role and area.
- `contract-form-styling`: Visual polish and responsive layout for the contract creation wizard.

### Modified Capabilities
- `e2e-testing`: E2E test suites for `general`, `nave`, and `admin` roles verifying filtered contract lists and form interactions.

## Impact

- `voluntarios-back/src/api/controllers/contractController.ts` (or equivalent) — role-based query filter.
- `voluntarios-front/src/app/page.tsx` and dashboard components — consume filtered results.
- `voluntarios-front/src/components/contract-form/*` — styling updates.
- E2E specs in `voluntarios-front/e2e/*` — role coverage.
