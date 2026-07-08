## ADDED Requirements

### Requirement: Server-side pagination
The system SHALL support pagination on `GET /api/contracts` via `page` and `pageSize` query parameters. The response SHALL include `data`, `total`, `page`, `pageSize`, and `totalPages`. Defaults: `page=1`, `pageSize=20`.

#### Scenario: Default pagination
- **WHEN** the client calls `GET /api/contracts` without any pagination params
- **THEN** the server returns the first 20 contracts with `page: 1`, `pageSize: 20`, and the correct `total` and `totalPages`

#### Scenario: Custom page size
- **WHEN** the client calls `GET /api/contracts?pageSize=50`
- **THEN** the server returns up to 50 contracts per page

#### Scenario: Specific page
- **WHEN** the client calls `GET /api/contracts?page=3&pageSize=10`
- **THEN** the server returns contracts 21–30 (offset 20, limit 10)

### Requirement: Server-side sorting
The system SHALL support column sorting on `GET /api/contracts` via `sortBy` and `sortOrder` query params. Allowed `sortBy` values SHALL be whitelisted to known DB columns.

#### Scenario: Ascending sort
- **WHEN** the client calls `GET /api/contracts?sortBy=nombre&sortOrder=asc`
- **THEN** the server returns contracts sorted alphabetically by `nombre` ascending

#### Scenario: Descending sort
- **WHEN** the client calls `GET /api/contracts?sortBy=fecha&sortOrder=desc`
- **THEN** the server returns contracts sorted by `fecha` descending (newest first)

#### Scenario: Invalid sortBy column
- **WHEN** the client calls `GET /api/contracts?sortBy=invalid_column`
- **THEN** the server returns 400 with an error message

### Requirement: Full-text search
The system SHALL support text search via a `search` query parameter that matches against `nombre`, `email`, and `areas`. Search SHALL be case-insensitive.

#### Scenario: Search by name
- **WHEN** the client calls `GET /api/contracts?search=María`
- **THEN** the server returns only contracts where `nombre` contains "María" (case-insensitive)

#### Scenario: Search by email
- **WHEN** the client calls `GET /api/contracts?search=test@example.com`
- **THEN** the server returns only contracts matching that email

#### Scenario: Search with pagination
- **WHEN** the client calls `GET /api/contracts?search=altius&page=1&pageSize=10`
- **THEN** the server returns paginated results filtered by the search term

#### Scenario: Empty search
- **WHEN** the client calls `GET /api/contracts?search=`
- **THEN** the server returns all contracts (no filtering)

### Requirement: Role-based filtering preserved
The system SHALL continue to apply role-based filtering (`admin` sees all, `nave` sees only Nave-area contracts, `general` excludes Nave-area contracts) on top of pagination/sorting/search.

#### Scenario: Admin sees all paginated
- **WHEN** an admin calls `GET /api/contracts?page=1&pageSize=20`
- **THEN** the server returns up to 20 contracts from the full unfiltered set

#### Scenario: Nave role sees filtered paginated
- **WHEN** a `nave`-role user calls `GET /api/contracts?page=1&pageSize=20`
- **THEN** the server returns up to 20 contracts filtered to only those with `areas` containing "Nave"

### Requirement: Paginated response shape
The response body SHALL be `{ data: Contract[], total: number, page: number, pageSize: number, totalPages: number }`.

#### Scenario: Response shape
- **WHEN** the client receives a paginated response
- **THEN** the body matches `{ data: [...], total: number, page: number, pageSize: number, totalPages: number }`

### Requirement: IRepository supports pagination
The `IRepository<T>` interface SHALL expose a `getPaginated(params)` method returning `PaginatedResult<T>`.

#### Scenario: Method exists
- **WHEN** code references `IRepository<T>`
- **THEN** it SHALL include `getPaginated(params)` with the correct signature
