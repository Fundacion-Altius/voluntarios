## Purpose

This specification defines the requirements for verifying that all major API endpoints work against the production Supabase backend.

## Requirements

### Requirement: Verify all API endpoints work with Supabase
The system SHALL provide a way to verify that all major API endpoints work against the production Supabase backend.

#### Scenario: Auth endpoint returns 200 with valid token
- **WHEN** a POST request is sent to /api/auth/login with valid Azure AD token
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include a JWT token

#### Scenario: Contracts endpoint returns data
- **WHEN** a GET request is sent to /api/contracts with a valid JWT
- **THEN** the response SHALL have status 200
- **AND** the response SHALL be an array (possibly empty)

#### Scenario: Health check endpoint works
- **WHEN** a GET request is sent to /api/health
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include database connection status

### Requirement: Send test survey submission
The system SHALL support testing survey submission against production Supabase.

#### Scenario: Survey submission succeeds
- **WHEN** a POST request is sent to /api/surveys with valid survey data
- **THEN** the response SHALL have status 201
- **AND** the data SHALL be persisted in the Supabase surveySubmissions table
