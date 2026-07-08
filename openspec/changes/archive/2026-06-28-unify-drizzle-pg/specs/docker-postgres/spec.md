## Purpose

A local Postgres 16 container in docker-compose for staging environment, replacing the current MariaDB container.

## Requirements

### Requirement: Postgres container in docker-compose

The project SHALL include a Postgres 16 service in `docker-compose.yml` alongside the existing Redis container.

#### Scenario: Postgres container starts
- **WHEN** `docker compose up -d` is run
- **THEN** a Postgres 16 container SHALL be created on port 5432
- **AND** the container SHALL have a health check
- **AND** the MariaDB container SHALL be removed

### Requirement: Database and user created on first start

The Postgres container SHALL create the `voluntarios` and `test` databases, and a `voluntarios_user` role with password, on initial startup.

#### Scenario: Databases created
- **WHEN** the Postgres container starts for the first time
- **THEN** databases `voluntarios` and `test` SHALL exist
- **AND** user `voluntarios_user` SHALL have full access to both databases

### Requirement: Tables created via Drizzle migrations

The Postgres staging environment SHALL use Drizzle Kit migrations (not a raw `init.sql`) to create and update tables.

#### Scenario: Migrations run on staging startup
- **WHEN** the backend starts with `NODE_ENV=staging`
- **THEN** pending Drizzle migrations SHALL be applied to the local Postgres
- **AND** the system SHALL log which migrations were applied

### Requirement: Seed data for staging

The staging environment SHALL seed initial user accounts so that manual testing can proceed without Supabase.

#### Scenario: Users seeded
- **WHEN** the staging Postgres has no users
- **THEN** the system SHALL insert the same seed users as production (admin, nave, general accounts)
