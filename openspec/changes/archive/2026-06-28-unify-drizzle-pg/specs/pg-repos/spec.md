## Purpose

Drizzle ORM + Postgres repositories for all entities (contract, user, survey, question, answer, submission). These repos serve both staging (local Postgres) and production (Supabase Postgres), selected by `NODE_ENV`.

## Requirements

### Requirement: All entities have a Postgres Drizzle repo

The system SHALL provide a Drizzle ORM repository for each entity, matching the existing `IRepository<T>` interface.

#### Scenario: Contract repo exists
- **WHEN** the factory selects the Postgres environment
- **THEN** a repo implementing `IRepository<DatosContrato>` SHALL be available
- **AND** it SHALL support `getAll`, `getById`, `create`, `update`, `delete`, `deleteAll`, `getPaginated`, `getAllFilteredByRole`

#### Scenario: User repo exists
- **WHEN** the factory selects the Postgres environment
- **THEN** a repo implementing `IUserRepository` SHALL be available

#### Scenario: Survey entity repos exist
- **WHEN** the factory selects the Postgres environment
- **THEN** repos implementing `IRepository<Survey>`, `IRepository<Question>`, `IRepository<SurveyAnswer>`, `IRepository<SurveySubmission>` SHALL be available

### Requirement: Postgres repos use Drizzle ORM with pg schema

All Postgres repos SHALL use `drizzle-orm/postgres-js` with the table definitions from `src/db/schema/pg/`.

#### Scenario: Query built with Drizzle query builder
- **WHEN** a repository query executes
- **THEN** it SHALL use `db.select().from(pgSchema.table)` pattern
- **AND** it SHALL NOT use raw SQL strings except for Postgres-specific JSON operators

### Requirement: Postgres repos support JSON containment for area arrays

The contract repo SHALL filter on JSON arrays (the `areas` column) using Postgres JSONB operators.

#### Scenario: Area containment filter
- **WHEN** filtering contracts by area
- **THEN** the query SHALL use the `@>` JSONB containment operator via `sql` tagged template
- **AND** it SHALL match the same semantics as the current MariaDB `JSON_CONTAINS`

### Requirement: Postgres repos support search with ILIKE

The contract repo SHALL support case-insensitive search on `nombre`, `email`, and `areas`.

#### Scenario: Search with ILIKE
- **WHEN** a search query is provided
- **THEN** the query SHALL use `ILIKE` for case-insensitive pattern matching
- **AND** it SHALL match the same semantics as the current Supabase `.or('nombre.ilike.*...')`

### Requirement: Postgres repos return the created entity ID on insert

To fix the existing race condition in `submitSurvey`, the `create` method SHALL return the inserted entity's ID.

#### Scenario: Create returns ID
- **WHEN** a new entity is created
- **THEN** the `Result<void>` from `create` SHALL include the generated ID in a `data` field

### Requirement: Connection pool is configurable per environment

The staging and production Postgres repos SHALL connect to different databases based on environment variables.

#### Scenario: Staging connects to localhost
- **WHEN** `NODE_ENV=staging`
- **THEN** the repo SHALL connect using `DB_HOST=localhost`, `DB_PORT=5432`, etc.

#### Scenario: Production connects to Supabase
- **WHEN** `NODE_ENV=production`
- **THEN** the repo SHALL connect using `SUPABASE_DB_HOST`, `SUPABASE_DB_PORT`, etc.
