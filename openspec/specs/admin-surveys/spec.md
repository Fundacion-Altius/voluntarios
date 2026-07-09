## Purpose

Admin surveys management page at /encuestas for viewing and managing surveys with filtering and pagination.

## Requirements

### Requirement: Surveys Management Page
The system SHALL provide an admin surveys management page for viewing and managing surveys.

#### Scenario: Admin accesses surveys page
- **WHEN** an authenticated admin user navigates to /encuestas
- **THEN** the system displays the surveys management page

#### Scenario: Non-admin attempts to access surveys page
- **WHEN** a non-admin user attempts to navigate to /encuestas
- **THEN** the system redirects to unauthorized page

### Requirement: Survey List Display
The system SHALL display a paginated list of all surveys with filtering capabilities.

#### Scenario: View survey list
- **WHEN** admin user views the surveys page
- **THEN** the system shows a list of surveys with pagination controls

#### Scenario: Filter surveys
- **WHEN** admin user applies filters (status, date range, etc.)
- **THEN** the system updates the survey list to show only matching surveys
