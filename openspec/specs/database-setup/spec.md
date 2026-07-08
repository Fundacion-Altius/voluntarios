## Purpose

This specification defines the requirements for database setup via Drizzle Kit migrations, including table creation and initial data seeding for both staging (local Postgres) and production (Supabase Postgres).

## Requirements

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

### Requirement: Tables created via Drizzle migrations

Table creation for both staging and production SHALL use Drizzle Kit migrations (not raw SQL or Supabase dashboard SQL).

#### Scenario: Tables created on first migration
- **WHEN** the initial Drizzle migration is applied
- **THEN** the users, roles, user_roles, contratos, encuestas, preguntas, survey_answers, and survey_submissions tables SHALL exist
- **AND** the `contratos.areas` column SHALL be `jsonb` type
- **AND** the `contratos.modalidad` column SHALL be `jsonb` type

### Requirement: Initial Data Seeding
The system SHALL seed initial user data with roles.

#### Scenario: Initial Users Seeded
- **WHEN** database setup script completes
- **THEN** cmarchena77@hotmail.com user exists with admin role
- **AND** voluntariado@fundacionaltius.org user exists with general role
- **AND** mercado@fundacionaltius.org user exists with nave role

### Requirement: Production startup applies Drizzle migrations
When the backend starts with NODE_ENV=production, the system SHALL run Drizzle Kit migrations to ensure all tables exist in Supabase Postgres.

#### Scenario: Migrations applied on production startup
- **WHEN** the backend starts with NODE_ENV=production
- **AND** there are pending Drizzle migrations
- **THEN** the system SHALL apply pending migrations
- **AND** the system SHALL log which migrations were applied

### Requirement: Production startup seeds roles
When the backend starts with NODE_ENV=production, the system SHALL seed the roles table with admin, general, and nave roles if they are missing.

#### Scenario: Roles seeded on first startup
- **WHEN** the backend starts with NODE_ENV=production
- **AND** the roles table is empty
- **THEN** the system SHALL insert roles: admin, general, nave
- **AND** the system SHALL log the seeded roles

### Requirement: Production startup seeds users
When the backend starts with NODE_ENV=production, the system SHALL seed the initial users with their Microsoft IDs and roles.

#### Scenario: Users seeded on first startup
- **WHEN** the backend starts with NODE_ENV=production
- **AND** the users table is empty
- **THEN** the system SHALL insert cmarchena77@hotmail.com with admin role
- **AND** the system SHALL insert voluntariado@fundacionaltius.org with general role
- **AND** the system SHALL insert mercado@fundacionaltius.org with nave role
- **AND** the system SHALL log the seeded users

### Requirement: Idempotent initialization
Running the init multiple times SHALL NOT cause errors or duplicate data.

#### Scenario: Second startup skips existing data
- **WHEN** the backend starts with NODE_ENV=production
- **AND** all tables already exist with data
- **THEN** the system SHALL NOT attempt to recreate tables or rerun migrations
- **AND** the system SHALL NOT duplicate seed data
