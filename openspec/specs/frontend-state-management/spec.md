## Purpose

Frontend state management using TanStack Query with extracted custom hooks for data fetching, auth, pagination, and form state.

## Requirements

### Requirement: TanStack Query provider in root layout
The frontend SHALL add a `QueryClientProvider` from `@tanstack/react-query` to the root layout, wrapping the application.

#### Scenario: QueryClientProvider wraps the app
- **WHEN** the application renders
- **THEN** a `QueryClientProvider` SHALL be present in the component tree, wrapping `ThemeProvider` → `AuthProvider` → `ContractProvider`

#### Scenario: QueryClient configured with sensible defaults
- **WHEN** the `QueryClient` is created
- **THEN** it SHALL have `staleTime` of 30 seconds and `retry` of 1 for failed queries

### Requirement: Separated hooks directory
The frontend SHALL have a `src/hooks/` directory containing custom hooks that encapsulate data fetching logic using TanStack Query. Each hook SHALL be in its own file.

#### Scenario: src/hooks/ directory exists
- **WHEN** the project structure is inspected
- **THEN** a `src/hooks/` directory SHALL exist with hook files

### Requirement: useContracts hook uses TanStack Query
The existing `useContracts` hook SHALL be refactored to use `@tanstack/react-query`'s `useQuery` and `useMutation` instead of manual `fetch()` calls.

#### Scenario: useContracts returns Query result
- **WHEN** `useContracts(params)` is called
- **THEN** it SHALL return a TanStack Query result object with `data`, `isLoading`, `error`, `refetch`

#### Scenario: Contract list is cached
- **WHEN** contracts are fetched via `useContracts`
- **THEN** subsequent renders SHALL use cached data until `staleTime` expires

### Requirement: useAuth hook uses TanStack Query
The existing `useAuth` hook SHALL be simplified. Login/logout operations SHALL use `useMutation` for better state tracking.

#### Scenario: Login mutation tracks state
- **WHEN** `login(email, password)` is called
- **THEN** `isPending`, `isError`, and `data` SHALL be available from the mutation result

### Requirement: New hooks extracted from existing components
Logic currently embedded in components SHALL be extracted into hooks where appropriate.

#### Scenario: useContractForm extracted from Contract.tsx
- **WHEN** examining the multi-step wizard in `Contract.tsx`
- **THEN** form state management SHALL be extracted into `useContractForm` hook in `src/hooks/useContractForm.ts`

#### Scenario: usePagination extracted from DataTable
- **WHEN** the pagination logic used in `DataTable` is inspected
- **THEN** it SHALL be extracted into a reusable `usePagination` hook
