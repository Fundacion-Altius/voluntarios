## Purpose

The dashboard DataTable provides pagination, column sorting, debounced search, loading skeletons, empty state, and responsive layout.

## Requirements

### Requirement: Pagination controls

The DataTable SHALL display page navigation (Previous/Next, page indicator) and a page-size selector (10, 20, 50, 100).

#### Scenario: Page navigation
- **WHEN** the user clicks "Next" on page 1
- **THEN** the table loads page 2 and "Previous" becomes enabled

#### Scenario: Page size change
- **WHEN** the user selects "50" from the page-size dropdown
- **THEN** the table reloads with `pageSize=50`

### Requirement: Column sorting

Each sortable column header SHALL be clickable to toggle sorting (none → asc → desc).

### Requirement: Debounced search

The DataTable SHALL have a search input that debounces API calls by 300ms.

#### Scenario: Typing triggers search
- **WHEN** the user types "María" in the search box
- **THEN** after 300ms of no typing, the API is called with `?search=María`

#### Scenario: Rapid typing avoids spamming
- **WHEN** the user types rapidly
- **THEN** only one API call is made 300ms after the last character

### Requirement: Dashboard loading skeleton

The dashboard SHALL display a skeleton placeholder while auth and data are loading.

#### Scenario: Initial load
- **WHEN** the user navigates to the dashboard and auth is still loading
- **THEN** a full-page skeleton matching the table layout is shown

#### Scenario: Data loading
- **WHEN** auth resolves but contracts are still being fetched
- **THEN** a table-shaped skeleton replaces the full-page skeleton

### Requirement: Empty state

The DataTable SHALL show "No hay contratos que coincidan con tu búsqueda." when no contracts match.

### Requirement: Responsive layout

The DataTable SHALL be horizontally scrollable on screens narrower than 768px.
