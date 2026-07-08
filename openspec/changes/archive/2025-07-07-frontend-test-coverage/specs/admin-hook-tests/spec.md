## ADDED Requirements

### Requirement: useUsers fetches, filters, and manages users
The `useUsers` hook SHALL fetch users from `/api/users`, expose CRUD operations (create, update, updateRole, delete), and support client-side search filtering by `display_name` and `email`.

#### Scenario: Fetch users on mount
- **WHEN** `useUsers()` is called and `fetch` resolves with user array
- **THEN** `users` contains the fetched data and `isLoading` is `false`

#### Scenario: Fetch users on mount with error
- **WHEN** `useUsers()` is called and `fetch` rejects
- **THEN** `error` is set and `isLoading` is `false`

#### Scenario: Search filters users by name
- **WHEN** `users` contains `[{ display_name: "Alice" }, { display_name: "Bob" }]` and `setSearch("Ali")` is called
- **THEN** `users` (returned) contains only `Alice`

#### Scenario: createUser sends POST and refetches
- **WHEN** `createUser({ name, email, role })` is called
- **THEN** a POST request is sent to `/api/users` with the user data, and `fetchUsers` is called again

#### Scenario: deleteUser sends DELETE and refetches
- **WHEN** `deleteUser("123")` is called
- **THEN** a DELETE request is sent to `/api/users/123`, and `fetchUsers` is called again

### Requirement: useSurveys fetches and manages surveys
The `useSurveys` hook SHALL fetch surveys from `/api/surveys`, support create/delete, and fetch survey reports from `/api/surveys/get-report`.

#### Scenario: Fetch surveys on mount
- **WHEN** `useSurveys()` is called and `fetch` resolves
- **THEN** `surveys` contains the data and `isLoading` is `false`

#### Scenario: createSurvey sends POST and refetches
- **WHEN** `createSurvey({ nombre, departamento, minutos })` is called
- **THEN** a POST request is sent to `/api/surveys` and `fetchSurveys` is called again

#### Scenario: fetchReport parses reportJson correctly
- **WHEN** `fetchReport()` is called and the API returns `{ success: true, data: { reportJson: { ... } } }`
- **THEN** `report` is set to the reportJson data

### Requirement: useDashboardStats fetches dashboard statistics
The `useDashboardStats` hook SHALL fetch stats from `/api/dashboard/stats` and expose `stats`, `isLoading`, and `error`.

#### Scenario: Fetch stats on mount
- **WHEN** `useDashboardStats()` is called and `fetch` resolves with stats data
- **THEN** `stats` contains the data and `isLoading` is `false`

#### Scenario: Fetch stats on mount with error
- **WHEN** `useDashboardStats()` is called and `fetch` rejects
- **THEN** `error` is set and `isLoading` is `false`

### Requirement: Admin useContracts fetches paginated contracts with filters
The admin `useContracts` hook SHALL fetch contracts from `/api/contracts` with pagination, sorting, search, area, and lugar filtering support.

#### Scenario: Fetch contracts with default params
- **WHEN** `useContracts()` is called
- **THEN** a GET request is sent to `/api/contracts` with `page=1`, `pageSize=20`

#### Scenario: Search triggers debounce and resets page to 1
- **WHEN** `setSearch("test")` is called
- **THEN** after 300ms, `debouncedSearch` becomes `"test"` and `page` resets to 1

#### Scenario: Sorting adds sortBy and sortOrder params
- **WHEN** `setSorting([{ id: "nombre", desc: true }])` is called
- **THEN** the fetch URL includes `sortBy=nombre&sortOrder=desc`

#### Scenario: Filters append query params
- **WHEN** `setAreas(["Nave"])` and `setLugares(["Madrid"])` are called
- **THEN** the fetch URL includes `areas=Nave&lugares=Madrid`

#### Scenario: Network error sets error state
- **WHEN** `fetch` rejects
- **THEN** `error` is set and `isLoading` is `false`

### Requirement: Duplicate useContracts hooks are consolidated
The system SHALL have exactly one `useContracts` hook, located at `src/app/admin/contratos/useContracts.ts`. The duplicate at `src/hooks/useContracts.ts` SHALL be removed, and all imports SHALL be updated.

#### Scenario: No remaining imports point to the deleted file
- **WHEN** searching for `from "@/hooks/useContracts"` or `from "../../hooks/useContracts"`
- **THEN** no results found
- **WHEN** running `pnpm run typecheck`
- **THEN** no errors from missing `useContracts` export
