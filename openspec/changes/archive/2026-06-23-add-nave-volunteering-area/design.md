## Context

The volunteering contract system allows volunteers to select one or more areas of involvement from a predefined set (e.g., "Reparto de Alimentos", "Coaching", "Formacion", etc.). Areas are stored as a JSON array in the `contratos` table (MariaDB/Supabase). The list of areas is defined as a TypeScript union type in both the backend and frontend, and rendered as checkboxes in the StepOne component.

A new area, "Nave", needs to be added. The change is purely additive — no existing data, types, or behavior is modified.

## Goals / Non-Goals

**Goals:**
- Add "Nave" as a selectable volunteering area in the contract form
- Ensure "Nave" is accepted by the backend type system and persists correctly

**Non-Goals:**
- No database schema changes (JSON column already accepts arbitrary strings)
- No API contract changes
- No UI redesign or new component work
- No migration or backfill of existing contracts

## Decisions

- **No separate database lookup**: The areas list is hardcoded in TypeScript types and the component, not stored in a DB table. This keeps the change minimal: just add the string literal to both type definitions and the checkbox list.
- **No alphabetization or reordering**: "Nave" will be inserted in a natural position in the list (following existing pattern — appended before "Otra" or placed alphabetically).
- **No i18n concerns**: The existing codebase uses hardcoded Spanish strings. "Nave" is already the Spanish name.

## Risks / Trade-offs

- **[Stale types]** If the frontend and backend type definitions drift, an invalid area could be sent. Mitigation: both are updated in the same change and kept in sync manually.
- **[Hardcoded list]** Adding areas requires a code change and redeploy. Mitigation: acceptable for the current scale; a future change could externalize areas to a DB table if needed.
