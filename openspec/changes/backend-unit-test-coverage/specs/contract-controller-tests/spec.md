## Purpose

Unit tests for `contractController.ts` (159 lines, 5 handlers) using the real in-memory contract repository — no mocking.

## Requirements

### Requirement: getAllContracts returns 200 with paginated contracts

#### Scenario: Returns 200 with full response for admin user
- **GIVEN** the in-memory contract repo has seed contracts
- **WHEN** `getAllContracts` is called by an admin user with valid pagination query params
- **THEN** it SHALL return a 200 JSON response with `{ data, total, page, pageSize, totalPages }`

#### Scenario: Returns 200 with role-filtered contracts for nave user
- **GIVEN** the in-memory contract repo has contracts with and without `'Nave'` area
- **WHEN** `getAllContracts` is called by a `nave`-role user
- **THEN** it SHALL return only contracts whose `areas` include `'Nave'`

#### Scenario: Returns 200 with role-filtered contracts for general user
- **GIVEN** the in-memory contract repo has contracts with and without `'Nave'` area
- **WHEN** `getAllContracts` is called by a `general`-role user
- **THEN** it SHALL return only contracts whose `areas` do NOT include `'Nave'`

#### Scenario: Returns 400 for invalid sortBy column
- **WHEN** `getAllContracts` is called with `sortBy=invalid_column`
- **THEN** it SHALL return a 400 response with an error message

#### Scenario: Returns 200 using fallback getAll when no pagination method available
- **GIVEN** the contract repository does not support `getPaginated`
- **WHEN** `getAllContracts` is called
- **THEN** it SHALL fall back to `getAll()` and return a 200 JSON array

#### Scenario: Returns 500 on repository error
- **WHEN** `getAllContracts` is called and the repository throws
- **THEN** it SHALL return a 500 response with error message

### Requirement: getContractById returns contract by ID with role-based access

#### Scenario: Returns 200 for existing contract (admin user)
- **GIVEN** a contract exists with a known ID
- **WHEN** `getContractById` is called by an admin user
- **THEN** it SHALL return a 200 JSON with the contract data

#### Scenario: Returns 404 for non-existent contract
- **WHEN** `getContractById` is called with an ID that does not exist
- **THEN** it SHALL return a 404 response

#### Scenario: Returns 403 for nave user accessing a non-nave contract
- **GIVEN** a contract exists that does NOT have area `'Nave'`
- **WHEN** `getContractById` is called by a `nave`-role user
- **THEN** it SHALL return a 403 response

#### Scenario: Returns 403 for general user accessing a nave contract
- **GIVEN** a contract exists with area `'Nave'`
- **WHEN** `getContractById` is called by a `general`-role user
- **THEN** it SHALL return a 403 response

### Requirement: createContract creates contract, user, and schedules email

#### Scenario: Returns 201 and creates contract, user, schedules survey email
- **WHEN** `createContract` is called with valid contract body
- **THEN** it SHALL:
  - Encrypt and compress the `firma` field
  - Create the contract in the repo
  - Create a user via `getUserRepository().create()`
  - Schedule a survey email via `surveyEmailScheduler`
  - Return a 201 response with `{ contract, user }`

#### Scenario: Returns 500 on error
- **WHEN** `createContract` is called and the contract repo create throws
- **THEN** it SHALL return a 500 response

### Requirement: updateContract updates contract by ID

#### Scenario: Returns 200 for existing contract
- **GIVEN** a contract exists with a known ID
- **WHEN** `updateContract` is called with valid body
- **THEN** it SHALL update the contract and return a 200 JSON response

#### Scenario: Returns 404 for non-existent contract
- **WHEN** `updateContract` is called with a non-existent ID
- **THEN** it SHALL return a 404 response

### Requirement: deleteContract deletes contract by ID

#### Scenario: Returns 204 for successful deletion
- **GIVEN** a contract exists with a known ID
- **WHEN** `deleteContract` is called
- **THEN** it SHALL delete the contract and return a 204 response

#### Scenario: Returns 404 for non-existent contract
- **WHEN** `deleteContract` is called with a non-existent ID
- **THEN** it SHALL return a 404 response

#### Scenario: Returns 500 when repository delete fails
- **GIVEN** the repository's `delete` returns `{ success: false, error: '...' }`
- **WHEN** `deleteContract` is called
- **THEN** it SHALL return a 500 with the error message
