## Purpose

Postgres migration pipeline via Drizzle Kit, replacing the current MySQL migrations in `drizzle/`.

## Requirements

### Requirement: Drizzle Kit configured for Postgres

The project SHALL have a `drizzle.pg.config.ts` that targets the Postgres schema files in `src/db/schema/pg/`.

#### Scenario: PG config file exists
- **WHEN** Drizzle Kit is run with the PG config
- **THEN** it SHALL read schemas from `src/db/schema/pg/index.ts`
- **AND** it SHALL output migrations to `drizzle/pg/`

### Requirement: Initial migration covers all tables

The initial Postgres migration SHALL create all tables: `users`, `contratos`, `encuestas`, `preguntas`, `survey_answers`, `survey_submissions`.

#### Scenario: All tables migrated
- **WHEN** the initial PG migration is generated and applied
- **THEN** all six tables SHALL exist in the target Postgres database
- **AND** the `contratos.areas` column SHALL be `jsonb` type
- **AND** the `contratos.modalidad` column SHALL be `jsonb` type
- **AND** environment variables `SUPABASE_DB_HOST`, `SUPABASE_DB_PORT`, `SUPABASE_DB_NAME`, `SUPABASE_DB_USER`, `SUPABASE_DB_PASSWORD` SHALL be read for connection credentials

### Requirement: Migration tasks registered in package.json

The project SHALL have npm scripts for generating and applying PG migrations.

#### Scenario: Scripts available
- **WHEN** `pnpm run db:pg:generate` is run
- **THEN** a new migration SHALL be generated from the current `pg/` schema files
- **AND** when `pnpm run db:pg:push` is run, pending migrations SHALL be pushed to the target database

### Requirement: Remove MySQL migration config

The existing `drizzle.config.ts` (MySQL) and `drizzle/` (MySQL migration output) SHALL be removed.

#### Scenario: MySQL config removed
- **WHEN** the change is complete
- **THEN** `drizzle.config.ts` SHALL be deleted
- **AND** the `drizzle/` directory SHALL be deleted
- **AND** the MySQL schema files in `src/db/schema/mysql/` SHALL be deleted
