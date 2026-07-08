## Why

Unit test coverage for `voluntarios-front` is concentrated on component rendering (9 spec files), but the core business logic — the wizard state machine, all admin data-fetching hooks, and shared hooks — has zero tests. Two bugs were already discovered during exploration (no step boundary guards, unhandled API errors in `handleSubmit`). Without tests, regressions in the admin panel or wizard flow go undetected.

## What Changes

- Add unit tests for `useContractForm` hook (step transitions, form field mutations, submit flow, error handling)
- Add unit test for `ContractContext` provider
- Add unit tests for admin data hooks (`useUsers`, `useSurveys`, `useDashboardStats`, admin `useContracts`)
- Add unit tests for shared hooks (`useDebounce`, `usePagination`)
- Fix two bugs discovered during exploration: step boundary guards and error handling in `handleSubmit`
- Consolidate duplicate `useContracts` hooks (currently split between `src/hooks/` and `src/app/admin/contratos/`)

## Capabilities

### New Capabilities
- `wizard-hook-tests`: Unit tests for `useContractForm` and `ContractContext` — the wizard state engine
- `admin-hook-tests`: Unit tests for admin data hooks (`useUsers`, `useSurveys`, `useDashboardStats`, admin `useContracts`)
- `shared-hook-tests`: Unit tests for `useDebounce` and `usePagination`

### Modified Capabilities
<!-- No spec-level behavior changes — all changes are additive (tests + bug fixes). -->

## Impact

- `src/hooks/useContractForm.ts` — two bug fixes (step guards, error handling)
- `src/hooks/useDebounce.ts` — new test file
- `src/hooks/usePagination.ts` — new test file
- `src/app/context.tsx` — new test file
- `src/app/admin/contratos/useContracts.ts` — new test file; may be consolidated with `src/hooks/useContracts.ts`
- `src/app/admin/usuarios/useUsers.ts` — new test file
- `src/app/admin/encuestas/useSurveys.ts` — new test file
- `src/app/admin/dashboard/useDashboardStats.ts` — new test file
- No new dependencies. Tests use existing Vitest/Jest setup with mocking for `next-auth/react` and `fetch`.
