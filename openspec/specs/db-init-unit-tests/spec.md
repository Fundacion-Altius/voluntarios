## Purpose

Unit tests for database initialization (MySQL and PostgreSQL Drizzle ORM setup). TBD.

## Requirements

### Requirement: createMysqlDb returns a Drizzle instance
The `createMysqlDb` function SHALL initialize a Drizzle ORM instance with the MySQL schema.

#### Scenario: Returns drizzle instance for valid pool
- **WHEN** `createMysqlDb` is called with a valid MySQL connection pool
- **THEN** it SHALL return a Drizzle ORM instance with the MySQL schema tables attached

### Requirement: getPgDb returns a Drizzle instance with lazy singleton
The `getPgDb` function SHALL lazily initialize and cache a Postgres Drizzle instance.

#### Scenario: Returns same instance on repeated calls
- **WHEN** `getPgDb` is called twice in succession
- **THEN** both calls SHALL return the same Drizzle instance (singleton)

#### Scenario: Creates client from environment variables
- **WHEN** `getPgDb` is called and `SUPABASE_DB_URL` or related env vars are set
- **THEN** it SHALL create a postgres.js client and return a Drizzle ORM instance with the PG schema
