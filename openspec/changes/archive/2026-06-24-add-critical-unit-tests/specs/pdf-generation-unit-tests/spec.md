## ADDED Requirements

### Requirement: PDF generation generates valid PDF bytes
The `generatePDF` function SHALL produce a valid PDF byte array for a valid `DatosContrato` input.

#### Scenario: Generates PDF for valid contract data
- **WHEN** `generatePDF` is called with valid `DatosContrato` containing all required fields, logo file, and signature data
- **THEN** it SHALL return a `Uint8Array` starting with PDF magic bytes (`%PDF`)

#### Scenario: Throws on invalid contract data
- **WHEN** `generatePDF` is called with contract data missing required fields
- **THEN** it SHALL throw an error

### Requirement: PDF controller handles all HTTP outcomes
The `generatePdf` Express handler SHALL return appropriate HTTP status codes for success and error conditions.

#### Scenario: Returns 200 with PDF download for existing contract
- **WHEN** a GET request is made to the PDF endpoint with a valid `contractId` query parameter that exists in a repository
- **THEN** the response SHALL have status 200 and trigger a file download

#### Scenario: Returns 404 for non-existent contract
- **WHEN** a GET request is made to the PDF endpoint with a `contractId` that does not exist in any repository
- **THEN** the response SHALL have status 404

#### Scenario: Returns 400 for missing contractId
- **WHEN** a GET request is made to the PDF endpoint without a `contractId` query parameter
- **THEN** the response SHALL have status 400

#### Scenario: Returns 500 when PDF generation fails
- **WHEN** a GET request is made to the PDF endpoint and `generatePDF` throws an error
- **THEN** the response SHALL have status 500
