## ADDED Requirements

### Requirement: Contracts page shows paginated contracts table
The system SHALL display a paginated, filterable contracts table at `/contratos`.

#### Scenario: Contracts page renders a data table
- **WHEN** an admin navigates to `/contratos`
- **THEN** a DataTable SHALL be rendered with columns: Nombre, Empresa, Email, Areas, Lugar, Fecha, Acciones
- **AND** the table SHALL support server-side pagination and sorting

#### Scenario: Contracts table can be filtered by search
- **WHEN** an admin types in the search input
- **THEN** the table SHALL filter contracts by name or email (300ms debounce)

#### Scenario: Contracts table can be filtered by area
- **WHEN** an admin selects an area from the AreaFilter dropdown
- **THEN** the table SHALL filter contracts by the selected area

#### Scenario: Contracts table can be filtered by location
- **WHEN** an admin selects a location from the LugarFilter dropdown
- **THEN** the table SHALL filter contracts by the selected location

#### Scenario: Contracts page has role-based filtering
- **WHEN** a user with role "nave" views the contracts page
- **THEN** only contracts with area "Nave" SHALL be shown
- **WHEN** a user with role "general" views the contracts page
- **THEN** only contracts without area "Nave" SHALL be shown

### Requirement: Contracts page offers PDF download
The system SHALL allow downloading a contract as PDF from the contracts table.

#### Scenario: PDF download button is available
- **WHEN** a contract row is rendered
- **THEN** an "Acciones" column SHALL contain a link to download the contract PDF
