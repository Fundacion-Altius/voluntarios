## ADDED Requirements

### Requirement: E2E tests cover role-based contract filtering
The E2E test suite SHALL verify that users with different roles see the correct filtered contracts list.

#### Scenario: general user does not see Nave-area contracts
- **WHEN** a user with role `general` logs in and fetches contracts
- **THEN** no returned contract SHALL have `areas` containing `Nave`

#### Scenario: nave user sees only Nave-area contracts
- **WHEN** a user with role `nave` logs in and fetches contracts
- **THEN** every returned contract SHALL have `areas` containing `Nave`

#### Scenario: admin user sees all contracts
- **WHEN** a user with role `admin` logs in and fetches contracts
- **THEN** the result SHALL include contracts with and without `Nave` area

### Requirement: E2E tests cover styled contract creation form
The E2E test suite SHALL verify that the contract creation form renders styled components correctly.

#### Scenario: Contract form uses styled inputs and buttons
- **WHEN** the user navigates to the contract form
- **THEN** all input fields SHALL be visible and styled
- **AND** all buttons SHALL be visible and styled
- **AND** the layout SHALL be responsive on mobile viewport
