## ADDED Requirements

### Requirement: Main Branch Protection
The main branch SHALL be protected from direct commits and require pull request approvals.

#### Scenario: Direct push rejection
- **WHEN** attempting git push origin main
- **THEN** the push is rejected with protection error

#### Scenario: Pull request requirement
- **WHEN** creating changes for main branch
- **THEN** a pull request with 2 approvals is required

### Requirement: Dev Branch Protection
The dev branch SHALL be protected from direct commits and require pull request approvals.

#### Scenario: Direct push rejection
- **WHEN** attempting git push origin dev
- **THEN** the push is rejected with protection error

#### Scenario: Pull request requirement
- **WHEN** creating changes for dev branch
- **THEN** a pull request with 1 approval is required

### Requirement: Feature Branch Freedom
Feature branches (feat/*) SHALL have no protection rules to allow development freedom.

#### Scenario: Direct commits allowed
- **WHEN** committing to feat/feature-name branch
- **THEN** the commit is accepted without restrictions

#### Scenario: Force push allowed
- **WHEN** using git push --force on feat/feature-name
- **THEN** the force push is accepted