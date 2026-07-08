## Purpose

Unit tests for shared utility hooks — `useDebounce` and `usePagination`. These hooks are used across the application and need to be tested independently.

## Requirements

### Requirement: useDebounce returns value after specified delay
The `useDebounce` hook SHALL return the initial value immediately, then update the returned value only after `delay` milliseconds of no changes to the input value.

#### Scenario: Returns initial value immediately
- **WHEN** `useDebounce("hello", 300)` is called
- **THEN** the returned value is `"hello"`

#### Scenario: Updates after delay
- **WHEN** the input value changes to `"world"` and 300ms elapses
- **THEN** the returned value becomes `"world"`

#### Scenario: Does not update before delay elapses
- **WHEN** the input value changes to `"world"` and only 100ms elapses
- **THEN** the returned value is still `"hello"`

#### Scenario: Multiple rapid changes use the latest value
- **WHEN** the input changes to `"a"`, then to `"ab"`, then to `"abc"` within 300ms
- **THEN** after 300ms from the last change, the returned value is `"abc"`

### Requirement: usePagination manages page and pageSize state
The `usePagination` hook SHALL manage `page` and `pageSize` state, resetting `page` to 1 when `pageSize` changes.

#### Scenario: Initial values match defaults
- **WHEN** `usePagination()` is called
- **THEN** `page` is `1` and `pageSize` is `20`

#### Scenario: Custom initial values are used
- **WHEN** `usePagination(3, 10)` is called
- **THEN** `page` is `3` and `pageSize` is `10`

#### Scenario: setPage updates the page
- **WHEN** `setPage(5)` is called
- **THEN** `page` is `5`

#### Scenario: setPageSize resets page to 1
- **WHEN** `setPageSize(50)` is called
- **THEN** `pageSize` is `50` and `page` resets to `1`
