## Purpose

Both MariaDB and Supabase CRUD operations use Drizzle ORM instead of raw SQL or Supabase REST client.

## Requirements

### Requirement: MariaDB CRUD operations use Drizzle

The system SHALL replace the raw `mariadb` pool queries with Drizzle ORM queries for the `contratos` table.

#### Scenario: Drizzle client is initialized for MariaDB

- **WHEN** the MariaDB repository module loads
- **THEN** it SHALL create a Drizzle client instance connected to the MariaDB pool

#### Scenario: getAll returns all contracts via Drizzle

- **WHEN** `getAll` is called
- **THEN** it SHALL execute `db.select().from(contratos)` using Drizzle instead of raw SQL

#### Scenario: create inserts a contract via Drizzle

- **WHEN** `create` is called with contract data
- **THEN** it SHALL execute `db.insert(contratos).values(values)` using Drizzle

#### Scenario: update modifies a contract via Drizzle

- **WHEN** `update` is called with an id and data
- **THEN** it SHALL execute `db.update(contratos).set(values).where(eq(contratos.id, id))` using Drizzle

### Requirement: Supabase CRUD operations use Drizzle

The system SHALL replace Supabase REST client queries with Drizzle ORM for all entity repositories where feasible.

#### Scenario: Drizzle client is initialized for Supabase PostgreSQL

- **WHEN** the Supabase repository module loads
- **THEN** it SHALL create a Drizzle client instance connected to Supabase's PostgreSQL database

#### Scenario: Contract repository methods use Drizzle

- **WHEN** `getContractRepository().getAll()` is called in production
- **THEN** it SHALL use `db.select().from(contratos)` via Drizzle

### Requirement: In-memory repositories remain unchanged

The in-memory repositories (development and tests) SHALL continue using plain arrays.

#### Scenario: InMemoryContractRepository still works

- **WHEN** `NODE_ENV=development` and a contract is queried
- **THEN** the in-memory repository SHALL return results from its internal array
