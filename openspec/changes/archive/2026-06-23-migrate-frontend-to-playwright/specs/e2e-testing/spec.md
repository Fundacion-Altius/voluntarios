## ADDED Requirements

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
