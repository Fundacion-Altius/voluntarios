## ADDED Requirements

### Requirement: Contract creation form is styled consistently
The contract creation wizard SHALL use shadcn UI components and consistent layout utilities across all steps.

#### Scenario: Step one uses styled inputs and checkboxes
- **WHEN** user opens the contract form
- **THEN** all text inputs SHALL use shadcn `Input`
- **AND** all checkboxes SHALL use shadcn `Checkbox`
- **AND** fields SHALL be arranged in a responsive single-column / two-column grid

#### Scenario: Step two provides a styled signature canvas
- **WHEN** user advances to the signature step
- **THEN** the canvas SHALL be wrapped in a styled `Card`
- **AND** navigation buttons SHALL use shadcn `Button`

#### Scenario: Step three uses styled consent checkboxes
- **WHEN** user reaches the consent step
- **THEN** each consent checkbox SHALL use shadcn `Checkbox`
- **AND** the submit button SHALL use shadcn `Button` with type `submit`

#### Scenario: Step four shows a styled success state
- **WHEN** user reaches the success step
- **THEN** the success message SHALL be inside a styled `Card`
- **AND** the download button SHALL use shadcn `Button`
