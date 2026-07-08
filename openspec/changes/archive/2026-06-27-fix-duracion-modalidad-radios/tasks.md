## 1. Fix handleInputChange in Contract.tsx

- [x] 1.1 Add `handleRadioChange` to Contract.tsx — sets duracion as string, modalidad as `[value]`
- [x] 1.2 Add `handleRadioChange` to Contract.tsx — modalidad sets single-element array `[value]`

## 2. Replace duración checkboxes with RadioGroup

- [x] 2.1 Replace the Checkbox grid in StepOne.tsx with shadcn RadioGroup for predefined options (días, semanas, meses, años, indeterminado)
- [x] 2.2 Wire "otros" option as a Radio item that reveals a text input when selected
- [x] 2.3 Remove the old `handleCheckboxChange`-based event for duración

## 3. Replace modalidad checkboxes with RadioGroup

- [x] 3.1 Replace the Checkbox grid in StepOne.tsx with shadcn RadioGroup (Presencial, Online, Híbrido)
- [x] 3.2 Wire the RadioGroup value to set `modalidad: [value]` in state

## 4. Verify

- [x] 4.1 Build succeeds (no typecheck script — `pnpm run build` passes)
- [x] 4.2 `pnpm test` on frontend — 48/48 pass
- [x] 4.3 `pnpm run build` on frontend — succeeds
- [x] 4.4 `pnpm test` on backend — 123/123 pass
