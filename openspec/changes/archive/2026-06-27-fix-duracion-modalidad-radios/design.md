## Context

The contract wizard (`StepOne.tsx`) renders duración and modalidad fields using Checkbox components with custom single-select logic. This is semantically incorrect — checkboxes imply multi-select, and the workaround in `handleInputChange` (Contract.tsx:49-68) doesn't handle these fields properly. The `else` branch at line 66 sets `{ [name]: checked }` which stores a boolean for duración instead of the string value. Modalidad uses the same pattern but is currently multi-select (array), which needs to change to single-select.

The backend stores modalidad as a JSON array (`JSONB` in PG, `TEXT` with JSON in MySQL). To avoid a DB migration, we keep this format — the frontend will pass a single-element array like `["Presencial"]`.

## Goals / Non-Goals

**Goals:**
- Duración rendered as shadcn RadioGroup (single-select) with 5 predefined options + "otros" custom text
- Modalidad rendered as shadcn RadioGroup (single-select) with 3 options
- Fix `handleInputChange` to correctly set duración as string and modalidad as single-element array
- All existing tests pass unchanged

**Non-Goals:**
- No backend changes (no DB migration, no validation changes, no type changes)
- No PDF changes (separate change)
- No horario fix (separate, if needed)
- No MySQL ENUM fix for "otros" custom values (separate, if needed)

## Decisions

1. **shadcn RadioGroup** over fixing the checkbox workaround. Radio buttons are semantically correct for single-select. The Radix-based shadcn RadioGroup integrates with existing UI pattern.
2. **Keep modalidad as array** — since the backend expects `ModalidadT[]` and stores as JSONB, we keep the type but restrict to one element. The frontend sends `[value]` instead of spreading. No DB migration, no validation changes, no backend test changes.
3. **New `onRadioChange` helper** in Contract.tsx rather than overloading `handleInputChange` further — avoids adding more conditionals to the already-complex checkbox handler.

## Risks / Trade-offs

- [Low] Modalidad is stored as JSONB array with one element — slightly redundant but avoids a DB migration. No practical impact on query performance.
- [Low] "otros" duración custom values will still fail in MariaDB (MySQL ENUM). This was already broken before. Out of scope for this change.
- [None] All existing backend tests pass since the API contract doesn't change — modalidad is still sent as an array.
