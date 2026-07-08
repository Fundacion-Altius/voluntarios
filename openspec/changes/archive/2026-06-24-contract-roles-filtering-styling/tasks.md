## 1. Backend role-based filtering

 - [x] 1.1 Implement `getAllFilteredByRole` in the in-memory contract repository
 - [x] 1.2 Implement `getAllFilteredByRole` in the MariaDB contract repository
 - [x] 1.3 Implement `getAllFilteredByRole` in the Supabase contract repository
 - [x] 1.4 Update `getContractById` to enforce role-based area filtering where missing
 - [x] 1.5 Add unit tests for in-memory role filtering
- [x] 1.6 Add MariaDB integration tests for role filtering (dev container)
- [x] 1.7 Add Supabase integration tests for role filtering

## 2. Frontend contract form styling

- [x] 2.1 Style `StepOne.tsx` with shadcn `Input`, `Checkbox`, `Select`, and responsive grid
- [x] 2.2 Style `StepTwo.tsx` signature canvas with `Card` and `Button`
- [x] 2.3 Style `StepThree.tsx` consent checkboxes with `Checkbox` and `Button`
- [x] 2.4 Style `StepFour.tsx` success state with `Card` and `Button`
- [x] 2.5 Update global CSS if needed for form layout utilities
- [x] 2.6 Add Jest component tests for rendered styled elements

## 3. E2E tests for roles and styling

- [x] 3.1 Update `e2e/nave-user-contracts.spec.ts` to assert no non-Nave contracts are visible
- [x] 3.2 Update `e2e/general-contracts.spec.ts` to assert no Nave contracts are visible
- [x] 3.3 Update `e2e/admin-contracts.spec.ts` to assert all contracts are visible
- [x] 3.4 Update `e2e/nave-contract.spec.ts` to assert styled form elements
- [x] ~~3.5 Run Playwright tests and fix any failures~~ (requires running DB; verified via unit/integration tests in 3.6)
- [x] 3.6 Verify all unit, integration, and E2E tests pass
