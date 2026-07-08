## 1. Git Setup

- [x] 1.1 Stage all pending changes in `voluntarios-front/` and commit with message `chore: stage pending frontend changes`
- [x] 1.2 Create and switch to new branch `feat/admin-ui-improvements` from `dev`

## 2. Button Cursor Fix

- [x] 2.1 Add `cursor: pointer` to the base `buttonVariants` className in `voluntarios-front/src/components/ui/button.tsx`

## 3. Chart Color Updates

- [x] 3.1 Update `ContractsByMonthChart.tsx` — change line stroke from `hsl(var(--primary))` to `hsl(var(--chart-1))` and update dot props
- [x] 3.2 Update `ContractsByLugarChart.tsx` — change bar fill from `hsl(var(--primary))` to `hsl(var(--chart-1))`
- [x] 3.3 Update `CorporateVsIndependentChart.tsx` — change `COLORS` array from `['hsl(var(--primary))', 'hsl(var(--muted-foreground))']` to `['hsl(var(--chart-2))', 'hsl(var(--chart-5))']`

## 4. Fix Survey Submit-Answer CSRF 403

- [x] 4.1 Add `/api/surveys/submit-answer` to the `CSRF_EXEMPT_PATHS` array in `voluntarios-back/src/utils/csrfUtils.ts`

## 5. Convert E2E Tests to Real Backend

- [ ] 5.1 Remove `page.route()` mocks from `voluntarios-front/e2e/survey-flow.spec.ts`
- [ ] 5.2 Rewrite survey-loads-and-displays test to use real `/api/questions` endpoint
- [ ] 5.3 Rewrite successful-submission test to POST to real backend without CSRF token
- [ ] 5.4 Add anonymous-access test that verifies POST without auth succeeds (no 403)
- [ ] 5.5 Remove or adapt error-handling test that relied on route overrides

## 6. Verify

- [x] 6.1 Run `pnpm run lint` in `voluntarios-front/` to check for errors
- [x] 6.2 Run `pnpm run build` in `voluntarios-front/` to confirm no build errors
- [x] 6.3 Run `pnpm run lint` in `voluntarios-back/` to check for errors
- [x] 6.4 Run `pnpm run typecheck` in `voluntarios-back/` to verify types
- [ ] 6.5 Run `pnpm run test:e2e` in `voluntarios-front/` with backend running in dev mode
