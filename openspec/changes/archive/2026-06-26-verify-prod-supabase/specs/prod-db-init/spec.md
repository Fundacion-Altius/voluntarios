## ADDED Requirements

### Requirement: Production startup creates PG tables if not exist
When the backend starts with NODE_ENV=production, the system SHALL create all required database tables in Supabase if they do not already exist.

#### Scenario: Tables created on first startup
- **WHEN** the backend starts with NODE_ENV=production
- **AND** the Supabase database has no tables
- **THEN** the system SHALL create the users, roles, user_roles, contratos, encuestas, preguntas, surveyAnswers, and surveySubmissions tables
- **AND** the system SHALL log which tables were created

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
- **THEN** the system SHALL NOT attempt to recreate tables
- **AND** the system SHALL NOT duplicate seed data
