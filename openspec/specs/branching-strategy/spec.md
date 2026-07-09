# Branching Strategy

## Purpose

Define a standardized git branching hierarchy: main (production), dev (integration), and feat/* (feature development).

## Requirements

### Requirement: Standardized Branch Hierarchy
The system SHALL maintain exactly 3 types of branches: main (production), dev (integration), and feat/* (feature development).

#### Scenario: Branch structure validation
- **WHEN** examining the git repository
- **THEN** only main, dev, and feat/* branches exist

#### Scenario: Main branch protection
- **WHEN** attempting to push directly to main
- **THEN** the push is rejected

#### Scenario: Dev branch protection
- **WHEN** attempting to push directly to dev
- **THEN** the push is rejected

### Requirement: Feature Branch Creation Source
All feature branches SHALL be created from the latest dev branch. Feature branches SHALL never be created from the main branch or any other branch type.

#### Scenario: Valid branch creation source
- **WHEN** creating a new feature branch
- **THEN** the source branch is dev

#### Scenario: Invalid branch creation source rejected
- **WHEN** attempting to create a feature branch from main
- **THEN** the operation is rejected with clear error message

### Requirement: Feature Branch Naming Convention
All feature branches SHALL follow the naming pattern feat/<change-name> where <change-name> matches the OpenSpec change directory name.

#### Scenario: Valid feature branch name
- **WHEN** creating a branch for OpenSpec change "user-auth"
- **THEN** the branch name is feat/user-auth

#### Scenario: Invalid feature branch name rejected
- **WHEN** attempting to create a branch named "user-auth" (without feat/ prefix)
- **THEN** the creation is rejected or a warning is shown

### Requirement: Feature Branch Lifecycle
Feature branches SHALL always be created from the latest dev branch and merged back to dev upon completion. Feature branches SHALL never be created from main.

#### Scenario: Feature branch creation
- **WHEN** starting development on a new feature
- **THEN** a new branch is created from latest dev (not main) with name feat/<feature-name>

#### Scenario: Invalid branch creation rejected
- **WHEN** attempting to create a feature branch from main
- **THEN** the creation is rejected or a warning is shown

#### Scenario: Feature branch completion
- **WHEN** all tasks for a feature are complete
- **THEN** the feature branch is merged to dev via pull request

#### Scenario: Feature branch cleanup
- **WHEN** a feature branch is successfully merged to dev
- **THEN** the feature branch is deleted
