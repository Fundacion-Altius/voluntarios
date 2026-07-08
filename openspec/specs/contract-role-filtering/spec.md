## Purpose

TBD — Role-based contract filtering specification.

## Requirements

### Requirement: Role-based contract filtering on the server
The backend SHALL filter the contracts list based on the authenticated user's role before returning results.

#### Scenario: general user receives only non-Nave contracts
- **WHEN** a user with role `general` requests `/api/contracts`
- **THEN** the response SHALL contain only contracts where `areas` does NOT include `Nave`

#### Scenario: nave user receives only Nave-area contracts
- **WHEN** a user with role `nave` requests `/api/contracts`
- **THEN** the response SHALL contain only contracts where `areas` includes `Nave`

#### Scenario: admin user receives all contracts
- **WHEN** a user with role `admin` requests `/api/contracts`
- **THEN** the response SHALL contain all contracts regardless of area

#### Scenario: Unauthenticated request falls back to all contracts
- **WHEN** a request to `/api/contracts` is made without authenticated user context
- **THEN** the response SHALL contain all contracts
