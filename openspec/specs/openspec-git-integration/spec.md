# OpenSpec Git Integration

## Purpose

Define how the OpenSpec tool integrates with git workflow for branch creation, validation, and archival.

## Requirements

### Requirement: OpenSpec Branch Creation
The OpenSpec tool SHALL provide automated branch creation when starting a new change.

#### Scenario: Branch creation suggestion
- **WHEN** running openspec propose "feature-name"
- **THEN** the tool suggests creating branch feat/feature-name

#### Scenario: Branch validation
- **WHEN** running openspec apply-change "feature-name"
- **THEN** the tool checks if feat/feature-name branch exists

### Requirement: OpenSpec Branch Archival
The OpenSpec tool SHALL automate branch merging and cleanup when archiving a change.

#### Scenario: Archive with branch merge
- **WHEN** running openspec archive-change "feature-name"
- **THEN** the tool creates a pull request from feat/feature-name to dev

#### Scenario: Branch cleanup after archive
- **WHEN** a change is successfully archived
- **THEN** the tool offers to delete the feature branch

### Requirement: Branch Status Tracking
The OpenSpec tool SHALL track branch status for each change.

#### Scenario: Status shows branch information
- **WHEN** running openspec status --change "feature-name"
- **THEN** the output includes branch name and divergence status

#### Scenario: Missing branch warning
- **WHEN** a change has no corresponding feature branch
- **THEN** the status shows a warning suggesting branch creation
