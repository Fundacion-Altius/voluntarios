## ADDED Requirements

### Requirement: Dashboard stats endpoint returns aggregated data
The system SHALL provide a `GET /api/dashboard/stats` endpoint that returns aggregated data for the admin dashboard.

#### Scenario: Stats endpoint returns all metrics
- **WHEN** an authenticated admin requests `GET /api/dashboard/stats`
- **THEN** the response SHALL contain:
  - `totalContracts`: total number of contracts
  - `activeVolunteers`: count of unique volunteer emails in contracts
  - `surveyCompletionRate`: ratio of survey submissions to contracts
  - `contractsByMonth`: array of `{ month, count }` objects
  - `contractsByLugar`: array of `{ lugar, count }` objects
  - `corporateVsIndependent`: `{ corporate, independent }` counts
  - `recentContracts`: array of the 5 most recent contracts

### Requirement: Dashboard stats endpoint requires admin role
The system SHALL restrict the stats endpoint to admin users.

#### Scenario: Non-admin gets 403
- **WHEN** a non-admin user requests `GET /api/dashboard/stats`
- **THEN** a 403 Forbidden response SHALL be returned

### Requirement: Contracts by month groups by contract creation date
The system SHALL group contracts by their `fecha` field for the monthly breakdown.

#### Scenario: Monthly aggregation uses contract fecha
- **WHEN** computing `contractsByMonth`
- **THEN** contracts SHALL be grouped by month of their `fecha` field

### Requirement: Corporate vs independent uses empresa field
The system SHALL determine corporate vs independent based on the `empresa` field being present.

#### Scenario: Corporate identified by empresa presence
- **WHEN** computing `corporateVsIndependent`
- **THEN** contracts with a non-empty `empresa` field SHALL be counted as corporate
- **AND** contracts with null/empty `empresa` SHALL be counted as independent
