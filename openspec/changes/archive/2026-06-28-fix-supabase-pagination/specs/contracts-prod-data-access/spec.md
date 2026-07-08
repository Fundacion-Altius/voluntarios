## ADDED Requirements

### Requirement: Server-side paginated contract listing
The production system SHALL provide server-side paginated contract queries that return only the requested page of data.

#### Scenario: First page returns page-size rows
- **WHEN** a request is made with `page=1&pageSize=20`
- **THEN** the response SHALL contain exactly 20 rows (or fewer if total < 20)
- **AND** the response body SHALL include `data`, `total`, `page`, `pageSize`, `totalPages`

#### Scenario: Pagination honors page boundaries
- **WHEN** a request is made for a page beyond the last
- **THEN** the response SHALL contain an empty `data` array

### Requirement: Server-side sorting by allowed columns
The production system SHALL sort contracts server-side by the requested column and direction.

#### Scenario: Sort by nombre ascending
- **WHEN** a request includes `sortBy=nombre&sortOrder=asc`
- **THEN** the results SHALL be sorted alphabetically by `nombre` in ascending order

#### Scenario: Sort by fecha descending
- **WHEN** a request includes `sortBy=fecha&sortOrder=desc`
- **THEN** the results SHALL be sorted by `fecha` in descending order

#### Scenario: Invalid sort column defaults to no sort
- **WHEN** a request includes a `sortBy` value not in the allowed list
- **THEN** the system SHALL fall back to default ordering (by `nombre` ascending)

### Requirement: Server-side search filtering
The production system SHALL filter contracts server-side by search query on `nombre` and `email`.

#### Scenario: Search returns only matching rows
- **WHEN** a request includes `search=maria`
- **THEN** the response SHALL only include contracts where `nombre` or `email` contains "maria" (case-insensitive)

### Requirement: Server-side area filtering
The production system SHALL filter contracts server-side by area membership.

#### Scenario: Filter by single area
- **WHEN** a request includes `areas=Educación`
- **THEN** the response SHALL only include contracts whose `areas` JSONB array contains "Educación"

#### Scenario: Filter by multiple areas
- **WHEN** a request includes `areas=Educación&areas=Salud`
- **THEN** the response SHALL include contracts whose `areas` contains "Educación" OR "Salud"

### Requirement: Role-based filtering
The production system SHALL filter contracts server-side based on the user's role.

#### Scenario: Admin sees all contracts
- **WHEN** the requesting user has role `admin`
- **THEN** all contracts SHALL be returned

#### Scenario: Nave role sees only Nave contracts
- **WHEN** the requesting user has role `nave`
- **THEN** only contracts with "Nave" in their `areas` SHALL be returned

#### Scenario: General role excludes Nave contracts
- **WHEN** the requesting user has role `general`
- **THEN** only contracts WITHOUT "Nave" in their `areas` SHALL be returned

### Requirement: Accurate total count
The production system SHALL return the total count of matching records (not total rows in table) for pagination UI.

#### Scenario: Total reflects filtered results
- **WHEN** a filter or search is applied
- **THEN** `total` in the response SHALL equal the number of records matching all filters, not the full table count

### Requirement: Request timeout
The frontend SHALL enforce a maximum wait time for contract API requests.

#### Scenario: Timeout on slow request
- **WHEN** a contract API request takes longer than 30 seconds
- **THEN** the request SHALL be aborted
- **AND** the user SHALL see an error message
