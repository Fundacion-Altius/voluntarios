## ADDED Requirements

### Requirement: Drizzle schema exists for every database table

The system SHALL define a Drizzle schema file for each database table, serving as the single source of truth for column types, constraints, and relations.

#### Scenario: Schema for contratos table

- **WHEN** the `contratos` schema is defined
- **THEN** it SHALL include columns: id (PK), nombre, fecha, domicilio, empresa (nullable), adulto, telefono, areas (JSON), duracion (nullable), modalidad (JSON), lugar, firma (JSON), derechoDatos, derechoImagen, derechoConfidencialidad, horario, email
- **THEN** the column types SHALL match the existing MariaDB `contratos` table definition

#### Scenario: Schema for encuestas (surveys) table

- **WHEN** the `encuestas` schema is defined
- **THEN** it SHALL include columns: id (PK), created_at, nombre, departamento, minutos

#### Scenario: Schema for preguntas (questions) table

- **WHEN** the `preguntas` schema is defined
- **THEN** it SHALL include columns: id (PK), createdAt, text, surveyID (FK to encuestas)

#### Scenario: Schema for survey_answers table

- **WHEN** the `survey_answers` schema is defined
- **THEN** it SHALL include columns: id (PK), created_at, survey_submission_id (FK), pregunta_id (FK), rating

#### Scenario: Schema for survey_submissions table

- **WHEN** the `survey_submissions` schema is defined
- **THEN** it SHALL include columns: id (PK), created_at, additionalAnswer (nullable), surveyID (FK to encuestas)

#### Scenario: Schema for users table

- **WHEN** the `users` schema is defined
- **THEN** it SHALL include columns: id (PK), email (unique), name, role (default 'general'), created_at

### Requirement: Drizzle config is set up for MariaDB

The system SHALL configure drizzle-kit to connect to MariaDB for migrations and introspection.

#### Scenario: drizzle.config.ts points to MariaDB

- **WHEN** the project is built or migrations are run
- **THEN** drizzle-kit SHALL use the MariaDB connection parameters from environment variables

### Requirement: Generated types from drizzle-kit

The system SHALL generate TypeScript types from Drizzle schema definitions for use throughout the codebase.

#### Scenario: Types are generated on build

- **WHEN** `drizzle-kit generate` is run
- **THEN** it SHALL produce TypeScript type definitions that match the schema columns
- **THEN** the generated types SHALL replace the existing hand-written entity interfaces

### Requirement: Relations between tables are defined

The system SHALL define Drizzle relations for foreign keys between tables.

#### Scenario: Survey has many questions

- **WHEN** the `encuestas` relation is defined
- **THEN** it SHALL define a one-to-many relation to `preguntas` via `surveyID`

#### Scenario: Question belongs to survey

- **WHEN** the `preguntas` relation is defined
- **THEN** it SHALL define a many-to-one relation to `encuestas`
