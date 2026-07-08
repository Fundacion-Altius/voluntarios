## Context

`voluntarios-front` already has Jest configured with `ts-jest`, `jsdom` environment, and `@testing-library/react`. Nine spec files exist covering component rendering. No tests exist for hooks or state management. The `useContractForm` hook (95 lines) drives the entire user-facing contract wizard; the admin section has ~500 lines of untested data-fetching hooks. Two bugs were identified: unbounded step navigation and silent API error swallowing.

## Goals / Non-Goals

**Goals:**
- Achieve unit test coverage for `useContractForm` hook and `ContractContext` provider
- Achieve unit test coverage for all admin data hooks (`useUsers`, `useSurveys`, `useDashboardStats`, admin `useContracts`)
- Achieve unit test coverage for shared hooks (`useDebounce`, `usePagination`)
- Fix the two bugs found in `useContractForm`: step boundary guards and error handling
- Consolidate the duplicate `useContracts` hook across `src/hooks/` and `src/app/admin/contratos/`

**Non-Goals:**
- Integration or E2E tests for the admin section (covered by separate E2E test additions)
- Component-level tests for admin pages (table rendering, chart rendering)
- Coverage thresholds or CI enforcement
- Backend test improvements

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Test framework | Jest (existing) | Already configured with `ts-jest`, `jsdom`, `@testing-library/jest-dom`. Zero new dependencies. |
| Hook testing library | `@testing-library/react` `renderHook` | Already available. Tests hooks in isolation without needing a full component wrapper. |
| API mocking | Global `fetch` mock via `jest.fn()` | All hooks use `fetch` or `apiPost` which wrap `fetch`. One mock strategy covers all. |
| NextAuth mocking | `jest.mock('next-auth/react')` | Mock `useSession` return values. Pattern already used in `useAuth.spec.ts`. |
| File naming | `*.spec.ts` (hooks), `*.spec.tsx` (components) | Follows existing convention. |
| Step guard implementation | `Math.max(1, s - 1)` / `Math.min(4, s + 1)` | Simplest approach, matches the 4-step wizard in `Contract.tsx`. |
| Error handling for handleSubmit | Try/catch with error state return | Hook returns `submitError: string | null` so calling component can show feedback. |
| Hook consolidation | Keep `src/app/admin/contratos/useContracts.ts`, delete `src/hooks/useContracts.ts` | Admin version is newer with `useCallback` wrappers. Update imports across codebase. |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| `renderHook` may not capture all edge cases of `useEffect`-based hooks | Supplement with integration-style tests that render a component using the hook |
| Consolidating `useContracts` may break imports | Grep all usages before deleting the duplicate file; verify with `pnpm run typecheck` |
| `handleSubmit` error state adds surface area to hook return | Keep it minimal — a single `string | null` field. The component shows an error toast or alert. |
