## 1. Fix bugs in useContractForm

- [x] 1.1 Add step boundary guards: `nextStep` capped at 4, `prevStep` floored at 1
- [x] 1.2 Add error handling to `handleSubmit`: wrap in try/catch, return `submitError` string

## 2. Test useContractForm hook (wizard-hook-tests)

- [x] 2.1 Create `src/hooks/useContractForm.spec.ts` with step transition tests
- [x] 2.2 Add form field mutation tests (text input, checkbox arrays, boolean checkboxes)
- [x] 2.3 Add handleRadioChange tests (modalidad wrapping, direct set)
- [x] 2.4 Add handleSignature test
- [x] 2.5 Add handleSubmit success and error path tests (mock `apiPost`)

## 3. Test ContractContext provider (wizard-hook-tests)

- [x] 3.1 Create `src/app/context.spec.tsx` with provider rendering test
- [x] 3.2 Add `setContractData` update test using `renderHook` with wrapper

## 4. Consolidate duplicate useContracts hooks

- [x] 4.1 Identify all imports of `@/hooks/useContracts` across the codebase
- [x] 4.2 Update imports to point to `@/app/admin/contratos/useContracts`
- [x] 4.3 Delete `src/hooks/useContracts.ts`
- [x] 4.4 Run tests to verify no broken imports

## 5. Test admin data hooks (admin-hook-tests)

- [x] 5.1 Create `src/app/admin/contratos/useContracts.spec.ts` with fetch, pagination, search, sort, filter, and error tests
- [x] 5.2 Create `src/app/admin/usuarios/useUsers.spec.ts` with fetch, search filter, create, update, delete tests
- [x] 5.3 Create `src/app/admin/encuestas/useSurveys.spec.ts` with fetch, create, delete, report tests
- [x] 5.4 Create `src/app/admin/dashboard/useDashboardStats.spec.ts` with fetch success and error tests

## 6. Test shared hooks (shared-hook-tests)

- [x] 6.1 Create `src/hooks/useDebounce.spec.ts` with initial value, delay, and rapid change tests
- [x] 6.2 Create `src/hooks/usePagination.spec.ts` with default values, setPage, and setPageSize reset tests

## 7. Verify

- [x] 7.1 Run `pnpm test` and confirm all tests pass
- [x] 7.2 Run `pnpm run typecheck` and confirm no type errors (no typecheck script available — tests pass, build succeeds)
