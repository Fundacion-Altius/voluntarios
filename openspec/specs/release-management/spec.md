# Release Management

## Purpose

Define the release process using release branches, version tagging, and hotfix procedures.

## Requirements

### Requirement: Release Branch Creation
The system SHALL use release branches for versioned deployments to production.

#### Scenario: Release branch creation
- **WHEN** preparing a new production release
- **THEN** a release/vX.Y.Z branch is created from dev

#### Scenario: Version tagging
- **WHEN** a release is deployed to production
- **THEN** the main branch is tagged with version vX.Y.Z

### Requirement: Release Process Workflow
The system SHALL follow a defined release process from dev to main.

#### Scenario: Release candidate testing
- **WHEN** release/vX.Y.Z branch is created
- **THEN** the release candidate is tested in staging environment

#### Scenario: Main branch merge
- **WHEN** release testing passes
- **THEN** release/vX.Y.Z is merged to main

#### Scenario: Release branch cleanup
- **WHEN** release is successfully deployed
- **THEN** the release/vX.Y.Z branch is deleted

### Requirement: Hotfix Process
The system SHALL support emergency hotfixes for production issues.

#### Scenario: Hotfix branch creation
- **WHEN** a critical production issue is identified
- **THEN** a hotfix/description branch is created from main

#### Scenario: Hotfix deployment
- **WHEN** hotfix testing passes
- **THEN** the hotfix is merged to both main and dev

#### Scenario: Hotfix versioning
- **WHEN** a hotfix is deployed
- **THEN** main is tagged with patch version vX.Y.Z+1
