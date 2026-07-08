## Purpose

Unit tests for the contract wizard state engine — `useContractForm` hook and `ContractContext` provider. Ensures step transitions, form mutations, signature capture, API submission, and context state are tested in isolation.

## Requirements

### Requirement: Step transitions are bounded to 1-4
The `useContractForm` hook SHALL guard `nextStep` so it never exceeds 4, and `prevStep` so it never goes below 1.

#### Scenario: nextStep at step 4 does not advance
- **WHEN** `step` is 4 and `nextStep()` is called
- **THEN** `step` remains 4

#### Scenario: prevStep at step 1 does not go back
- **WHEN** `step` is 1 and `prevStep()` is called
- **THEN** `step` remains 1

#### Scenario: nextStep advances from step 1 to 2
- **WHEN** `step` is 1 and `nextStep()` is called
- **THEN** `step` becomes 2

#### Scenario: prevStep goes back from step 3 to 2
- **WHEN** `step` is 3 and `prevStep()` is called
- **THEN** `step` becomes 2

### Requirement: handleSubmit calls API and advances step on success
`handleSubmit` SHALL POST `datosContrato` to `/api/contracts` via `apiPost`, and on 2xx response SHALL call `nextStep`.

#### Scenario: Successful submission advances to next step
- **WHEN** `handleSubmit()` is called and `apiPost` resolves with `{ ok: true }`
- **THEN** `nextStep()` is called and `step` increments

#### Scenario: Failed submission throws error and does NOT advance
- **WHEN** `handleSubmit()` is called and `apiPost` resolves with `{ ok: false, status: 500 }`
- **THEN** an error is thrown and `step` does not change

### Requirement: Form field mutations update `datosContrato` correctly
`handleInputChange` SHALL update the correct field in `datosContrato` based on input element name, type, value, and checked state.

#### Scenario: Text input updates its corresponding field
- **WHEN** `handleInputChange` is called with a text input `{ name: "nombre", value: "Juan", type: "text" }`
- **THEN** `datosContrato.nombre` is `"Juan"` and other fields are unchanged

#### Scenario: Checkbox toggles `areas` array
- **WHEN** `handleInputChange` is called with a checked checkbox `{ name: "areas", value: "Nave", type: "checkbox", checked: true }`
- **THEN** `datosContrato.areas` includes `"Nave"`
- **WHEN** called again with the same input but `checked: false`
- **THEN** `datosContrato.areas` excludes `"Nave"`

#### Scenario: Checkbox toggles `modalidad` array
- **WHEN** `handleInputChange` is called with `{ name: "modalidad", value: "Online", type: "checkbox", checked: true }`
- **THEN** `datosContrato.modalidad` includes `"Online"`

#### Scenario: Boolean checkbox updates its boolean field
- **WHEN** `handleInputChange` is called with `{ name: "derechoDatos", type: "checkbox", checked: true }`
- **THEN** `datosContrato.derechoDatos` is `true`

### Requirement: handleRadioChange sets modalidad or other fields
`handleRadioChange` SHALL set `modalidad` to a single-element array when name is `"modalidad"`, and set a simple field otherwise.

#### Scenario: Radio change for modalidad wraps value in array
- **WHEN** `handleRadioChange("modalidad", "Presencial")` is called
- **THEN** `datosContrato.modalidad` is `["Presencial"]`

#### Scenario: Radio change for other field sets value directly
- **WHEN** `handleRadioChange("adulto", "NO")` is called
- **THEN** `datosContrato.adulto` is `"NO"`

### Requirement: handleSignature updates firma field
`handleSignature` SHALL set `datosContrato.firma` to the provided data URL string.

#### Scenario: Signature data URL is stored
- **WHEN** `handleSignature("data:image/png;base64,...")` is called
- **THEN** `datosContrato.firma` is `"data:image/png;base64,..."`

### Requirement: ContractContext provider stores and provides ContractData
The `ContractProvider` SHALL make `contractData` and `setContractData` available to children via context.

#### Scenario: Provider renders children
- **WHEN** wrapping children with `<ContractProvider>`
- **THEN** children are rendered

#### Scenario: setContractData updates the value
- **WHEN** `setContractData({ name: "Test", date: "2024-01-01", signature: "sig" })` is called from a consumer
- **THEN** `contractData` reflects the new values
