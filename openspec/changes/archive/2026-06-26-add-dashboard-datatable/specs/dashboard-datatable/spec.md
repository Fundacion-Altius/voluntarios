## ADDED Requirements

### Requirement: Pagination controls
The DataTable SHALL display page navigation (Previous/Next buttons, page number indicator) and a page-size selector (10, 20, 50, 100).

#### Scenario: Page navigation
- **WHEN** the user clicks "Next" on page 1
- **THEN** the table loads page 2 and the "Previous" button becomes enabled

#### Scenario: Page size change
- **WHEN** the user selects "50" from the page-size dropdown
- **THEN** the table reloads with `pageSize=50` (starts at page 1) and the API is called with the new page size

### Requirement: Column sorting
Each sortable column header SHALL be clickable to toggle sorting (none → asc → desc).

#### Scenario: Click to sort ascending
- **WHEN** the user clicks the "Nombre" column header
- **THEN** the table sorts by `nombre` ascending and an ascending arrow indicator is shown

#### Scenario: Click to toggle descending
- **WHEN** the user clicks the "Nombre" column header again (was ascending)
- **THEN** the table sorts by `nombre` descending (arrow reverses)

#### Scenario: Click to clear sort
- **WHEN** the user clicks the "Nombre" column header a third time (was descending)
- **THEN** the sort is cleared (default order restored)

### Requirement: Debounced search
The DataTable SHALL have a search input above the table. The input SHALL debounce API calls by 300ms after the user stops typing.

#### Scenario: Typing triggers search
- **WHEN** the user types "María" in the search box
- **THEN** after 300ms of no typing, the API is called with `?search=María` and the table updates

#### Scenario: Rapid typing avoids spamming
- **WHEN** the user types "María Altius" rapidly
- **THEN** only one API call is made 300ms after the last character

#### Scenario: Clearing search
- **WHEN** the user clears the search box
- **THEN** after 300ms, the API is called with no search param (returns all contracts)

### Requirement: Dashboard loading skeleton
The dashboard SHALL display a skeleton placeholder (animated pulse) while the auth check and initial data fetch are in progress, replacing the plain "Loading..." text.

#### Scenario: Initial load
- **WHEN** the user navigates to the dashboard and auth is still loading
- **THEN** a full-page skeleton matching the table layout is shown (header row + 5 skeleton rows)

#### Scenario: Auth resolved, data loading
- **WHEN** auth resolves but contracts are still being fetched
- **THEN** a table-shaped skeleton (header + rows) replaces the full-page skeleton

### Requirement: DataTable loading state
The DataTable SHALL show a row of skeleton cells inside the table body while data is being fetched (for pagination, sorting, or search changes).

#### Scenario: Pagination loading
- **WHEN** the user clicks "Next" and the API call is in flight
- **THEN** the table body shows skeleton rows instead of the previous page content

#### Scenario: Search loading
- **WHEN** the user types a search and the debounced API call is in flight
- **THEN** the table body shows skeleton rows

### Requirement: Empty state
The DataTable SHALL show an empty state when no contracts match the current search/filters.

#### Scenario: No results
- **WHEN** no contracts match the current search/filters
- **THEN** "No hay contratos que coincidan con tu búsqueda." is displayed

### Requirement: Responsive layout
The DataTable SHALL be horizontally scrollable on narrow screens.

#### Scenario: Mobile overflow
- **WHEN** the viewport is less than 768px wide
- **THEN** the table container shows a horizontal scrollbar
