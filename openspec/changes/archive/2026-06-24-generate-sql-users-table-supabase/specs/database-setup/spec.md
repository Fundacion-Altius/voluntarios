## ADDED Requirements

### Requirement: Users Table Creation
The system SHALL generate SQL code to create the users table in Supabase.

#### Scenario: SQL Code Generation
- **WHEN** database setup script is executed
- **THEN** SQL code for users table is generated
- **AND** SQL code includes all required fields

### Requirement: Roles Table Creation
The system SHALL generate SQL code to create the roles table in Supabase.

#### Scenario: Roles Table SQL Generation
- **WHEN** database setup script is executed
- **THEN** SQL code for roles table is generated
- **AND** SQL code includes role_id, role_name fields

### Requirement: User Roles Junction Table
The system SHALL generate SQL code to create the user_roles junction table.

#### Scenario: User Roles Table SQL Generation
- **WHEN** database setup script is executed
- **THEN** SQL code for user_roles table is generated
- **AND** SQL code includes user_id, role_id fields

### Requirement: Initial Data Seeding
The system SHALL seed initial user data with roles.

#### Scenario: Initial Users Seeded
- **WHEN** database setup script completes
- **THEN** cmarchena77@hotmail.com user exists with admin role
- **AND** voluntariado@fundacionaltius.org user exists with general role
- **AND** mercado@fundacionaltius.org user exists with nave role