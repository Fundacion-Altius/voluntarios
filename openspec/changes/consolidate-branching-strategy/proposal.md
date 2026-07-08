## Why

The current branching strategy is inconsistent and confusing, with multiple long-lived branches (main, dev, deploy-v2, build) serving unclear purposes. This leads to divergent histories, unclear promotion paths, and difficulty tracking feature development. A consolidated branching strategy will provide clarity, reduce risk through feature isolation, and integrate seamlessly with the OpenSpec workflow.

## What Changes

- **NEW**: Standardized branching hierarchy with only 2 long-lived branches: `main` (production) and `dev` (integration/staging)
- **NEW**: Mandatory feature branches for all OpenSpec changes using `feat/<change-name>` naming convention
- **NEW**: Clear workflow: feature branches → dev → main with defined merge processes
- **NEW**: Branch protection rules for main and dev branches
- **NEW**: Automated OpenSpec integration for branch creation and merging
- **BREAKING**: Deprecation of deploy-v2, build, and other non-standard branches
- **MODIFIED**: dev branch purpose changes from primary development to integration/staging only
- **MODIFIED**: Feature development must happen in dedicated feat/* branches, not directly in dev

## Capabilities

### New Capabilities
- `branching-strategy`: Standardized branching model with main/dev/feat hierarchy
- `openspec-git-integration`: Automated branch creation and merging tied to OpenSpec commands
- `branch-protection`: Protection rules for main and dev branches
- `release-management`: Defined release process from dev to main
- `hotfix-workflow`: Emergency fix process for production issues
- `migration-plan`: Step-by-step migration from current to new strategy

### Modified Capabilities
- *(none - this is a process change that doesn't modify existing functional requirements)*

## Impact

- **Git Repository**: Branch structure simplification, protection rules, and workflow changes
- **OpenSpec Tooling**: New integration points for branch management
- **CI/CD Pipelines**: Updates to recognize new branch names and workflow
- **Team Workflow**: New development process requiring feature branches for all changes
- **Documentation**: Updates to README, CONTRIBUTING, and onboarding materials
- **Development**: Initial migration effort, then ongoing process improvements