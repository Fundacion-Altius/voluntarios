## Context

The backend (`voluntarios-back`) already has role-based access logic in `contractController.ts`: `getAllContracts` attempts to call `contractRepo.getAllFilteredByRole(req.user.role)`, and `getContractById` blocks unauthorized users with 403. The frontend dashboard (`voluntarios-front/src/app/dashboard/page.tsx`) currently fetches `/api/contracts` without relying on server-side filtering beyond what the backend already applies. The contract creation form lives in `voluntarios-front/src/app/components/Contract.tsx` and its step components; it lacks consistent spacing, layout structure, and responsive styling.

## Goals / Non-Goals

**Goals:**
- Ensure `general` users receive only contracts whose `areas` do NOT contain `Nave`.
- Ensure `nave` users receive only contracts whose `areas` contain `Nave`.
- Ensure `admin` users receive all contracts.
- Style the contract creation form consistently across steps using existing shadcn components and utility classes.

**Non-Goals:**
- Changing the underlying data model or database schema.
- Adding new authentication strategies (relies on existing `req.user.role`).
- Redesigning pages outside the contract wizard and dashboard.

## Decisions

- **Server-side filtering is the source of truth.** The controller already prefers `getAllFilteredByRole(role)`. We will:
  - Implement `getAllFilteredByRole` in each repository backend (in-memory, MariaDB, Supabase) so behavior is consistent across environments.
  - In-memory: filter the in-memory array by role.
  - MariaDB: add a query or condition that filters `areas` JSON based on role.
  - Supabase: apply a Supabase query filter using `or`/`contains` on the `areas` column.
- **Frontend remains passive.** The dashboard simply displays whatever the backend returns. No client-side filtering is added.
- **Form styling approach:** Apply `Card`, `Label`, `Input`, `Checkbox`, `Button` from `src/components/ui/*` to each step component. Use a single-column layout on mobile and a two-column grid for related fields on desktop. Add `required` indicators and error state classes.

## Risks / Trade-offs

- **MariaDB JSON filtering complexity:** `areas` is stored as JSON. Querying it may require `JSON_CONTAINS` or similar. Mitigation: verify the column type in `init.sql` and drizzle schema before writing queries.
- **Supabase PostgREST limitations:** Complex JSON filtering may need a PostgREST `or` clause. Mitigation: confirm the Supabase schema supports the planned filter.
- **Test flakiness in E2E:** Role tests depend on seed data and auth. Mitigation: reuse existing seed users (`admin@...`, `nave@...`) and existing e2e patterns for login/token acquisition.
