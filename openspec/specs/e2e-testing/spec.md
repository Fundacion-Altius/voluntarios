## Purpose

The E2E test suite verifies the complete contract creation flow using Playwright, from form input to PDF download, with mocked backend API calls.

## Requirements

### Requirement: E2E test suite covers the full contract generation flow
The E2E test suite SHALL verify the complete contract creation flow, from form input to PDF download, with mocked backend API calls.

#### Scenario: User fills personal data and submits step one
- **WHEN** the user navigates to the contract form
- **WHEN** the user fills in name, DNI/NIE, address, phone, email, selects areas, modality, location, and schedule
- **WHEN** the user clicks "Siguiente"
- **THEN** the user SHALL advance to the signature step

#### Scenario: User signs on the canvas
- **WHEN** the user reaches the signature step
- **WHEN** the user draws on the signature canvas
- **THEN** the canvas SHALL contain non-empty pixel data
- **AND** clicking "Siguiente" SHALL advance to the consent step

#### Scenario: User accepts consent checkboxes and submits
- **WHEN** the user reaches the consent step
- **WHEN** the user checks the data, confidentiality, and image rights boxes
- **WHEN** the user clicks "Enviar contrato"
- **THEN** a SHALL be POST request be sent to the backend
- **AND** the user SHALL see the success step

#### Scenario: User downloads the generated PDF
- **WHEN** the user reaches the success step
- **WHEN** the user clicks "Descargar contrato"
- **THEN** a PDF file SHALL be downloaded
- **AND** the downloaded file SHALL have a `.pdf` extension

### Requirement: E2E tests use mocked API
The E2E test suite SHALL intercept backend API calls to run without a real backend.

#### Scenario: API calls are intercepted
- **WHEN** the E2E test runs
- **THEN** GET requests to `/api/contracts/:id` SHALL return a 404 mock
- **AND** POST requests to `/api/contracts` SHALL return a 201 mock

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

### Requirement: E2E tests cover lugar query parameter filtering

The E2E test suite SHALL verify that the `?lugar=` query parameter filters contracts by location.

#### Scenario: single lugar filter returns only matching contracts
- **WHEN** a user with role `admin` fetches contracts with `?lugar=Madrid`
- **THEN** all returned contracts SHALL have `lugar` equal to `"Madrid"`

#### Scenario: multiple lugares filter returns contracts in any of the specified locations
- **WHEN** a user with role `admin` fetches contracts with `?lugar=Madrid&lugar=Barcelona`
- **THEN** returned contracts SHALL have `lugar` equal to either `"Madrid"` or `"Barcelona"`

### Requirement: E2E tests cover pagination shape and behavior

The E2E test suite SHALL verify the paginated response includes correct metadata and that page navigation works.

#### Scenario: response includes pagination metadata
- **WHEN** a user fetches contracts with `?page=1&pageSize=5`
- **THEN** the response SHALL include `data`, `total`, `page`, `pageSize`, and `totalPages` fields

#### Scenario: pageSize limits the number of returned contracts
- **WHEN** a user fetches contracts with `?pageSize=5`
- **THEN** the `data` array SHALL contain at most 5 items
- **AND** `pageSize` SHALL equal 5

#### Scenario: page parameter returns the correct slice
- **WHEN** there are at least 25 contracts in the database
- **WHEN** a user fetches contracts with `?page=2&pageSize=10`
- **THEN** the response SHALL have `page` equal to 2
- **AND** no contract in `data` SHALL be on a different page than expected

### Requirement: E2E tests cover sort parameters

The E2E test suite SHALL verify that `?sortBy=` and `?sortOrder=` correctly order results.

#### Scenario: sortBy ascending returns contracts in alphabetical order
- **WHEN** a user fetches contracts with `?sortBy=nombre&sortOrder=asc`
- **THEN** the `data` array SHALL be sorted by `nombre` in ascending order

#### Scenario: sortBy descending returns contracts in reverse order
- **WHEN** a user fetches contracts with `?sortBy=nombre&sortOrder=desc`
- **THEN** the `data` array SHALL be sorted by `nombre` in descending order

#### Scenario: invalid sortBy returns 400
- **WHEN** a user fetches contracts with `?sortBy=invalidColumn`
- **THEN** the response SHALL have status 400
- **AND** the body SHALL contain an error message

### Requirement: E2E tests cover error states

The E2E test suite SHALL verify that the API returns appropriate HTTP status codes for error conditions.

#### Scenario: missing auth token returns 401
- **WHEN** a request to `GET /api/contracts` is made without an `Authorization` header
- **THEN** the response SHALL have status 401

#### Scenario: nonexistent contract returns 404
- **WHEN** a request to `GET /api/contracts/nonexistent-id` is made with a valid admin token
- **THEN** the response SHALL have status 404

#### Scenario: nonexistent user returns 404
- **WHEN** a request to `GET /api/users/nonexistent-id` is made with a valid admin token
- **THEN** the response SHALL have status 404

### Requirement: E2E tests cover CSRF token validation

The E2E test suite SHALL verify that state-changing requests without a valid CSRF token are rejected.

#### Scenario: POST without CSRF token returns 403
- **WHEN** a POST request to `/api/contracts` is made with a valid auth token but no `X-CSRF-Token` header
- **THEN** the response SHALL have status 403

#### Scenario: POST with a fake CSRF token returns 403
- **WHEN** a POST request to `/api/contracts` is made with a valid auth token and a made-up `X-CSRF-Token` value
- **THEN** the response SHALL have status 403

### Requirement: E2E tests cover individual contract detail

The E2E test suite SHALL verify that `GET /api/contracts/:id` returns the full contract object.

#### Scenario: admin can view any contract by ID
- **WHEN** an admin creates a contract and fetches it by ID
- **THEN** the response SHALL have status 200
- **AND** the returned object SHALL have the same `id` as the created contract

#### Scenario: nave user can view a Nave-area contract by ID
- **WHEN** a nave user fetches a Nave-area contract by ID
- **THEN** the response SHALL have status 200
- **AND** the returned object SHALL contain `"Nave"` in its `areas`

### Requirement: E2E tests cover role-based access control enforcement

The E2E test suite SHALL verify that non-admin users cannot access admin-only endpoints.

#### Scenario: nave user cannot update a contract
- **WHEN** a nave user sends a PUT request to `/api/contracts/:id`
- **THEN** the response SHALL have status 403

#### Scenario: nave user cannot delete a contract
- **WHEN** a nave user sends a DELETE request to `/api/contracts/:id`
- **THEN** the response SHALL have status 403

#### Scenario: general user cannot list users
- **WHEN** a general user sends a GET request to `/api/users`
- **THEN** the response SHALL have status 403

#### Scenario: general user cannot create a user
- **WHEN** a general user sends a POST request to `/api/users`
- **THEN** the response SHALL have status 403

### Requirement: E2E tests cover styled contract creation form
The E2E test suite SHALL verify that the contract creation form renders styled components correctly.

#### Scenario: Contract form uses styled inputs and buttons
- **WHEN** the user navigates to the contract form
- **THEN** all input fields SHALL be visible and styled
- **AND** all buttons SHALL be visible and styled
- **AND** the layout SHALL be responsive on mobile viewport
