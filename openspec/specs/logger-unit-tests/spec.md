## Purpose

Unit tests for the Winston logger configuration. TBD.

## Requirements

### Requirement: Logger is a configured Winston instance
The `logger` export SHALL be a Winston Logger with console transport at `info` level.

#### Scenario: Logger is defined and has expected methods
- **WHEN** the logger module is imported
- **THEN** `logger` SHALL be defined with `info`, `warn`, `error` methods

#### Scenario: Logger writes to console
- **WHEN** `logger.info('test message')` is called
- **THEN** it SHALL output a formatted message without throwing
