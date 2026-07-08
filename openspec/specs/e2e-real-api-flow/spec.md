## Purpose

The real API flow E2E test verifies the complete contract generation pipeline from the user's perspective, making real backend calls instead of using mocks.

## Requirements

### Requirement: Real API flow creates a contract via the browser wizard

The E2E test SHALL open the browser, fill the multi-step form, sign, accept consents, submit, and confirm success with a real backend.

#### Scenario: user completes the full wizard and sees success
- **WHEN** the user navigates to the contract form at `/`
- **WHEN** the user fills in name, DNI/NIE, address, phone, email, selects areas (Nave), modality (Presencial), location (Madrid), and schedule (tardes)
- **WHEN** the user clicks "Siguiente" and reaches the signature step
- **WHEN** the user draws on the signature canvas and clicks "Siguiente"
- **WHEN** the user checks all consent checkboxes and clicks "Enviar contrato"
- **THEN** the user SHALL see a success message
- **AND** the success message SHALL contain "Tu contrato se ha enviado"

### Requirement: Real API flow verifies contract appears in the dashboard

The E2E test SHALL log into the dashboard as an admin and verify the newly created contract appears in the contract list.

#### Scenario: new contract is visible in the admin dashboard
- **WHEN** the admin logs in and navigates to `/dashboard`
- **WHEN** the admin searches for the contract ID
- **THEN** the contract SHALL appear in the data table

### Requirement: Real API flow downloads the generated PDF

The E2E test SHALL verify that a PDF can be downloaded after contract creation.

#### Scenario: user can download the contract PDF
- **WHEN** the user reaches the success step
- **WHEN** the user clicks the download button
- **THEN** a file with `.pdf` extension SHALL be downloaded
