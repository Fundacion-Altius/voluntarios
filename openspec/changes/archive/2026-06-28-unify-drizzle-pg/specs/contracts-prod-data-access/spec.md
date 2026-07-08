## ADDED Requirements

### Requirement: Contract repo uses Drizzle ORM + Postgres

The production contract data access SHALL use Drizzle ORM with `postgres.js` instead of the supabase-js REST client.

#### Scenario: Drizzle query instead of REST call
- **WHEN** a contract listing request is made in production
- **THEN** the query SHALL use `db.select().from(contratos)` via Drizzle ORM
- **AND** the query SHALL NOT use `supabase.from('contratos').select('*')`

### Requirement: JSON containment uses Postgres `@>` operator

Area filtering SHALL use the Postgres JSONB `@>` containment operator via Drizzle's `sql` tagged template.

#### Scenario: Area filter with @>
- **WHEN** filtering contracts by area in production
- **THEN** the query SHALL include `areas @> '"Nave"'::jsonb`
- **AND** the query SHALL NOT use `supabase.from('contratos').contains('areas', ['Nave'])`

## REMOVED Requirements

### Requirement: Supabase two-phase pagination

The existing two-phase pagination (first fetch `id, areas` with count, filter areas in JS, then fetch full rows) SHALL be replaced with a single Drizzle ORM query that handles area filtering, search, sort, and pagination in one database roundtrip.

## UNCHANGED Requirements

All existing contract data access requirements (pagination, sorting, search, area filtering, role filtering, accurate counts, timeout) remain. Only the implementation layer changes from supabase-js to Drizzle ORM.
