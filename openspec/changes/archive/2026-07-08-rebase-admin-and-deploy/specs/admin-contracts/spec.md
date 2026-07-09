## ADDED Requirements

### Requirement: Contracts Management Page
The system SHALL provide an admin contracts management page for viewing and managing contracts.

#### Scenario: Admin accesses contracts page
- **WHEN** an authenticated admin user navigates to /contratos
- **THEN** the system displays the contracts management page

#### Scenario: Non-admin attempts to access contracts page
- **WHEN** a non-admin user attempts to navigate to /contratos
- **THEN** the system redirects to unauthorized page

### Requirement: Contract List Display
The system SHALL display a paginated list of all contracts with filtering capabilities.

#### Scenario: View contract list
- **WHEN** admin user views the contracts page
- **THEN** the system shows a list of contracts with pagination controls

#### Scenario: Filter contracts
- **WHEN** admin user applies filters (status, date range, etc.)
- **THEN** the system updates the contract list to show only matching contracts