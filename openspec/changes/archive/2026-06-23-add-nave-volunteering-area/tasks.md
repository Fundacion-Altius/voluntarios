## 1. Backend Type Update

- [x] 1.1 Add `"Nave"` to the `AreasT` union type in `voluntarios-back/src/entities/types.ts`

## 2. Frontend Type Update

- [x] 2.1 Add `"Nave"` to the `AreasT` union type in `voluntarios-front/src/app/types.ts`

## 3. Frontend UI Update

- [x] 3.1 Add `"Nave"` to the `areasOptions` array in `voluntarios-front/src/app/components/StepOne.tsx`

## 4. Verify

- [x] 4.1 Run backend type check (`npm run typecheck` or `tsc --noEmit`)
- [x] 4.2 Run frontend type check (`npm run typecheck` or `tsc --noEmit`) — 13/13 tests pass, build error pre-existing (cypress chai-string types)
- [x] 4.3 Run existing tests to confirm no regressions
