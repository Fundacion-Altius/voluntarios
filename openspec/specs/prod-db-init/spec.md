## Purpose

On production startup, the system creates all required PostgreSQL tables and seeds roles and users if they do not exist.

## Requirements

### Requirement: Production startup creates PG tables if not exist

When the backend starts with NODE_ENV=production, the system SHALL create all required database tables if missing.

#### Scenario: Tables created on first startup
- **WHEN** the backend starts with NODE_ENV=production
- **AND** the database has no tables
- **THEN** the system SHALL create tables for users, roles, user_roles, contratos, encuestas, preguntas, surveyAnswers, surveySubmissions

### Requirement: Production startup seeds roles

#### Scenario: Roles seeded on first startup
- **WHEN** the backend starts with NODE_ENV=production
- **AND** the roles table is empty
- **THEN** the system SHALL insert roles: admin, general, nave

### Requirement: Production startup seeds users

#### Scenario: Users seeded on first startup
- **WHEN** the backend starts with NODE_ENV=production
- **AND** the users table is empty
- **THEN** the system SHALL seed initial admin and staff users

### Requirement: Idempotent initialization

Running the init multiple times SHALL NOT cause errors or duplicate data.
