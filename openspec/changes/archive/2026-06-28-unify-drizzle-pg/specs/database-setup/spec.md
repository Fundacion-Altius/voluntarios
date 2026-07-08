## ADDED Requirements

### Requirement: Postgres local container replaces MariaDB

The development and staging environments SHALL use a local Postgres 16 container instead of MariaDB 11.

#### Scenario: docker-compose runs Postgres not MariaDB
- **WHEN** `docker compose up -d` is executed
- **THEN** a Postgres 16 container SHALL start on port 5432
- **AND** no MariaDB container SHALL be present

### Requirement: Staging startup applies Drizzle migrations

When the backend starts with `NODE_ENV=staging`, the system SHALL apply pending Drizzle Kit migrations to the local Postgres database.

#### Scenario: Migrations applied on staging startup
- **WHEN** the backend starts with `NODE_ENV=staging`
- **AND** there are pending Drizzle migrations
- **THEN** the system SHALL run the pending migrations
- **AND** the system SHALL log which migrations were applied

## REMOVED Requirements

### Requirement: MariaDB-specific startup check

The existing startup connection check to MariaDB (`src/index.ts` line 21-27) SHALL be removed and replaced with a Postgres-equivalent check.

## UNCHANGED Requirements

The existing requirements for table creation, seeding, and idempotency remain, but the implementation switches from raw SQL in `src/db/init.ts` to Drizzle Kit migrations.
