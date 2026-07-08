## ADDED Requirements

### Requirement: Contracts are filtered by user role

The system SHALL filter the list of contracts returned by the GET /api/contracts endpoint based on the authenticated user's role.

#### Scenario: Nave role sees only Nave contracts

- **WHEN** a user with role `nave` requests GET /api/contracts
- **THEN** the backend SHALL return only contracts where the `areas` field includes "Nave"

#### Scenario: General role sees all except Nave contracts

- **WHEN** a user with role `general` requests GET /api/contracts
- **THEN** the backend SHALL return all contracts EXCEPT those where the `areas` field includes "Nave"

#### Scenario: Admin role sees all contracts

- **WHEN** a user with role `admin` requests GET /api/contracts
- **THEN** the backend SHALL return all contracts without filtering

#### Scenario: Single contract access is also role-restricted

- **WHEN** a user with role `nave` requests GET /api/contracts/:id for a contract whose `areas` does NOT include "Nave"
- **THEN** the backend SHALL respond with HTTP 403 Forbidden

#### Scenario: Admin can access any single contract

- **WHEN** a user with role `admin` requests GET /api/contracts/:id
- **THEN** the backend SHALL return the contract regardless of its areas
