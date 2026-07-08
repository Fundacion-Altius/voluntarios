## Why

The contract wizard's duración and modalidad fields use Checkbox components with custom single-select logic, which is semantically wrong and produces bugs: clicking a duración option stores a boolean (`true`) instead of the selected string value, the checked state never appears, and the "otros" checkbox erroneously lights up. Modalidad uses multi-select checkboxes but should be single-select.

## What Changes

- **Duración**: Replace Checkbox grid with shadcn RadioGroup (single-select). Options: días, semanas, meses, años, indeterminado, otros (with text input).
- **Modalidad**: Replace Checkbox grid with shadcn RadioGroup (single-select). Options: Presencial, Online, Híbrido.
- **Contract.tsx handleInputChange**: Remove the generic `else` branch that sets `{ [name]: checked }` for duración. Add explicit handling for duración (single string) and modalidad (single-element array, keeping backwards compatibility with JSONB storage).
- **No DB changes**: modalidad remains stored as `JSONB/JSON` array in the database (will be a single-element array like `["Presencial"]`).

## Capabilities

### New Capabilities

(none — this is a UI fix, not a new capability)

### Modified Capabilities

(none — no spec-level requirement changes, only implementation)

## Impact

- `voluntarios-front/src/app/components/StepOne.tsx` — duración and modalidad sections rewritten
- `voluntarios-front/src/app/components/Contract.tsx` — `handleInputChange` updated
- `voluntarios-front/src/app/types.ts` — `ModalidadT` type remains an array (no type change needed)
- No backend changes required
