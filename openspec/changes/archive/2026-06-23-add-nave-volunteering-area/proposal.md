## Why

"Nave" is a new volunteering area offered by the foundation. Volunteers need to be able to select it as one of their areas of involvement in the volunteering contract. Currently it is not listed among the available area options.

## What Changes

- Add **"Nave"** as a new option in the `AreasT` union type in both the backend and frontend type definitions
- Add **"Nave"** as a checkbox option in the StepOne form component so users can select it during contract signing

## Capabilities

### New Capabilities
- `volunteering-areas`: Defines and renders the set of volunteering areas (checkboxes), persists them as a JSON array in the contract, and regenerates when the available areas change.

### Modified Capabilities
- None. This is purely additive — no existing requirement changes.

## Impact

- **Backend types**: `voluntarios-back/src/entities/types.ts` — add `"Nave"` to the `AreasT` union
- **Frontend types**: `voluntarios-front/src/app/types.ts` — add `"Nave"` to the `AreasT` union
- **Frontend UI**: `voluntarios-front/src/app/components/StepOne.tsx` — add `"Nave"` to the `areasOptions` array rendered as checkboxes
- **Database**: No migration needed — `areas` is a JSON column that accepts any string values
- **No API changes, no new dependencies, no breaking changes**
