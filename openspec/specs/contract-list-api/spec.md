## Purpose

The GET /api/contracts endpoint supports server-side pagination, column sorting, full-text search, and role-based filtering.

## Requirements

### Requirement: Server-side pagination

The system SHALL support pagination on `GET /api/contracts` via `page` and `pageSize` query parameters. Response: `{ data, total, page, pageSize, totalPages }`. Defaults: `page=1`, `pageSize=20`.

#### Scenario: Default pagination
- **WHEN** the client calls `GET /api/contracts` without pagination params
- **THEN** the server returns the first 20 contracts with correct metadata

#### Scenario: Custom page size
- **WHEN** the client calls `GET /api/contracts?pageSize=50`
- **THEN** the server returns up to 50 contracts per page

### Requirement: Server-side sorting

The system SHALL support sorting via `sortBy` and `sortOrder` query params, whitelisted to known DB columns.

#### Scenario: Ascending sort
- **WHEN** the client calls `GET /api/contracts?sortBy=nombre&sortOrder=asc`
- **THEN** the server returns contracts sorted by `nombre` ascending

#### Scenario: Invalid sortBy column
- **WHEN** the client calls `GET /api/contracts?sortBy=invalid_column`
- **THEN** the server returns 400 with an error

### Requirement: Full-text search

The system SHALL support case-insensitive text search via a `search` parameter matching against `nombre`, `email`, and `areas`.

#### Scenario: Search by name
- **WHEN** the client calls `GET /api/contracts?search=María`
- **THEN** the server returns only contracts where `nombre` contains "María"

#### Scenario: Search with pagination
- **WHEN** the client calls `GET /api/contracts?search=altius&page=1&pageSize=10`
- **THEN** the server returns paginated results filtered by search

### Requirement: Role-based filtering preserved

Role-based filtering (admin sees all, nave sees Nave-area only, general excludes Nave) SHALL apply on top of pagination/sorting/search.

### Requirement: Paginated response shape

Response: `{ data: Contract[], total: number, page: number, pageSize: number, totalPages: number }`.

### Requirement: IRepository supports pagination

The `IRepository<T>` interface SHALL expose a `getPaginated(params)` method returning `PaginatedResult<T>`.
