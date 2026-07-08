## ADDED Requirements

### Requirement: Build pipeline compiles TypeScript to CommonJS
The build pipeline SHALL compile TypeScript source files into a runnable CommonJS Node.js application.

#### Scenario: Successful production build
- **WHEN** the developer runs `npm run build`
- **THEN** output SHALL be written to the `build/` directory
- **AND** the output SHALL be CommonJS JavaScript files
- **AND** the output SHALL be runnable with `node build/index.js`

#### Scenario: Dev server starts
- **WHEN** the developer runs `npm run dev`
- **THEN** the application SHALL start and watch for file changes
- **AND** changes SHALL trigger automatic recompilation and restart

### Requirement: Tests run with equivalent coverage and speed
The test runner SHALL execute all existing tests with the same or better performance and equivalent coverage reporting.

#### Scenario: Unit tests pass
- **WHEN** the developer runs `npm test`
- **THEN** all unit tests SHALL pass
- **AND** test output SHALL include verbose naming

#### Scenario: Watch mode works
- **WHEN** the developer runs `npm run test:w`
- **THEN** tests SHALL run in watch mode
- **AND** file changes SHALL trigger re-runs

#### Scenario: Coverage report generated
- **WHEN** the developer runs `npm run test:c`
- **THEN** a coverage report SHALL be generated
- **AND** the coverage threshold SHALL match or exceed the current Jest coverage

### Requirement: Type checking is optionally available
The project SHALL provide a way to run TypeScript type checking separately from the build.

#### Scenario: Type check passes
- **WHEN** the developer runs `npm run typecheck`
- **THEN** TypeScript compiler SHALL check types without emitting files
- **AND** SHALL report any type errors
