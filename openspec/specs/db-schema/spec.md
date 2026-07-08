## Purpose

A Drizzle schema defines every database table as the single source of truth for column types, constraints, and relations.

## Requirements

### Requirement: Drizzle schema exists for every database table

The system SHALL define a Drizzle schema file for each database table.

#### Scenario: Schema for contratos table

- **WHEN** the `contratos` schema is defined
- **THEN** it SHALL include columns: id (PK), nombre, fecha, domicilio, empresa (nullable), adulto, telefono, areas (JSON), duracion (nullable), modalidad (JSON), lugar, firma (JSON), derechoDatos, derechoImagen, derechoConfidencialidad, horario, email

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

### Requirement: Relations between tables are defined

The system SHALL define Drizzle relations for foreign keys between tables.

#### Scenario: Survey has many questions

- **WHEN** the `encuestas` relation is defined
- **THEN** it SHALL define a one-to-many relation to `preguntas` via `surveyID`

#### Scenario: Question belongs to survey

- **WHEN** the `preguntas` relation is defined
- **THEN** it SHALL define a many-to-one relation to `encuestas`
