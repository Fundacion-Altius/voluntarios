## ADDED Requirements

### Requirement: System SHALL include "Nave" in the list of volunteering areas
The system SHALL accept "Nave" as a valid value in the `areas` field of a contract, and SHALL render it as a selectable checkbox in the contract form.

#### Scenario: User can select "Nave" in the contract form
- **WHEN** the user fills out StepOne of the contract
- **THEN** "Nave" SHALL appear as a checkbox option among the volunteering areas
- **AND** the user SHALL be able to toggle it on/off

#### Scenario: Contract with "Nave" area is submitted and persisted
- **WHEN** the user submits a contract with "Nave" selected in the `areas` field
- **THEN** the backend SHALL accept the value "Nave" without validation errors
- **AND** the contract SHALL be persisted with "Nave" in the `areas` JSON array

#### Scenario: Contract with "Nave" area is retrieved
- **WHEN** the user views a contract that has "Nave" in its areas
- **THEN** the contract data SHALL include "Nave" in the areas array upon retrieval
