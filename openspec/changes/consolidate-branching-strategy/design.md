## Context

The current repository has evolved organically with multiple long-lived branches serving unclear purposes. The main branch contains production code, dev branch has active development with OAuth features, deploy-v2 branch contains deployment-specific fixes, and various temporary branches exist. This complexity makes it difficult to track feature development, understand promotion paths, and maintain code quality. The OpenSpec workflow is not integrated with the branching strategy, leading to manual coordination overhead.

## Goals / Non-Goals

**Goals:**
- Establish a clear, consistent branching hierarchy (main → dev → feat/*)
- Integrate OpenSpec changes with git branches (1:1 mapping)
- Implement branch protection rules for critical branches
- Define clear workflows for feature development, releases, and hotfixes
- Provide automated tooling support through OpenSpec commands
- Create comprehensive documentation and team training

**Non-Goals:**
- Changing the underlying git hosting platform
- Modifying CI/CD pipeline tools (just adapting to new branch names)
- Enforcing specific commit message formats (recommendations only)
- Implementing automated testing strategies (out of scope)
- Changing the monorepo structure (backend/front separation remains)

## Decisions

### Decision: Two Long-Lived Branches Only
**Choice**: Maintain only `main` (production) and `dev` (integration) as long-lived branches
**Rationale**: 
- Reduces complexity from current 5+ branches to 2 clear purposes
- Main = production stability, Dev = integration testing
- Feature branches provide isolation for development
**Alternatives Considered**:
- Three long-lived branches (main, staging, dev): Rejected as unnecessary complexity
- Single main branch with feature flags: Rejected due to deployment risk

### Decision: Feature Branch Creation Point
**Choice**: Feature branches SHALL always branch off from dev, never from main
**Rationale**:
- Ensures all features include the latest integration changes
- Prevents feature branches from missing critical dev branch updates
- Maintains main branch as pristine production-only code
**Alternatives Considered**:
- Branching from main: Rejected as bypasses integration testing
- Choice between dev/main: Rejected as adds complexity and risk

### Decision: Feature Branch Naming Convention
**Choice**: `feat/<change-name>` prefix for all feature branches
**Rationale**:
- Clear visual distinction from long-lived branches
- Direct mapping to OpenSpec change names
- Consistent with existing feat/survey-email pattern
**Alternatives Considered**:
- `feature/<name>`: Rejected as more verbose
- No prefix: Rejected due to ambiguity with other branch types

### Decision: OpenSpec-Git Integration Points
**Choice**: Integrate at proposal, apply, and archive commands
**Rationale**:
- Proposal phase: Suggest branch creation
- Apply phase: Validate branch exists
- Archive phase: Automate merge and cleanup
**Alternatives Considered**:
- Full automation (auto-create branches): Rejected as too opinionated
- No integration: Rejected as missing opportunity for workflow improvement

### Decision: Branch Protection Rules
**Choice**: Strict protection for main, moderate for dev, none for feat/*
**Rationale**:
- Main branch: 2 approvals, status checks - production stability
- Dev branch: 1 approval, status checks - integration quality
- Feature branches: No protection - development freedom
**Alternatives Considered**:
- Same rules for main and dev: Rejected as dev needs more flexibility
- No protection for dev: Rejected as integration quality is important

### Decision: Release Process
**Choice**: Release branches (release/vX.Y.Z) from dev → main
**Rationale**:
- Allows testing of release candidates
- Clear versioning and tagging
- Separates release preparation from ongoing development
**Alternatives Considered**:
- Direct dev → main merges: Rejected as no release candidate testing
- Feature branches → main: Rejected as bypasses integration testing

### Decision: Hotfix Workflow
**Choice**: Hotfix branches from main → merge to both main and dev
**Rationale**:
- Immediate production fix deployment
- Ensures fix is included in next release
- Maintains consistency between branches
**Alternatives Considered**:
- Hotfix → main only: Rejected as creates divergence
- Hotfix → dev only: Rejected as delays production fix

## Risks / Trade-offs

### Risk: Merge Conflict Overhead
**[Risk]**: Increased merge conflicts when multiple feature branches merge to dev simultaneously
**[Mitigation]**: 
- Regular dev branch updates during feature development
- Small, frequent merges instead of large batches
- Conflict resolution as part of feature completion criteria
- Feature flags for partial deployments of large features

### Risk: Long-Running Feature Branches
**[Risk]**: Feature branches that take weeks/months become difficult to merge as dev moves ahead
**[Mitigation]**:
- Regular rebasing against dev (weekly recommended)
- Break large features into smaller OpenSpec changes
- Feature flags for incremental deployment
- Time-based branch health checks

### Risk: Team Adoption Resistance
**[Risk]**: Team members accustomed to current workflow may resist change
**[Mitigation]**:
- Comprehensive training and documentation
- Clear migration plan with gradual rollout
- Side-by-side comparison showing benefits
- Designated "branch strategy champions" for support
- Grace period with both old and new workflows allowed

### Risk: OpenSpec Tooling Complexity
**[Risk]**: Adding git integration to OpenSpec increases tool complexity
**[Mitigation]**:
- Make git operations optional/suggested, not mandatory
- Provide clear opt-out paths
- Comprehensive error handling and user guidance
- Gradual rollout of automation features

### Risk: CI/CD Pipeline Adaptation
**[Risk]**: Existing CI/CD pipelines may need significant updates for new branch names
**[Mitigation]**:
- Inventory all pipeline triggers and branch references
- Gradual migration with backward compatibility
- Comprehensive testing of updated pipelines
- Rollback plan for pipeline issues

### Risk: Initial Migration Downtime
**[Risk]**: Branch cleanup and protection setup may disrupt ongoing work
**[Mitigation]**:
- Schedule migration during low-activity period
- Communicate clearly with all team members
- Provide migration checklist and support
- Allow temporary exceptions during transition

## Migration Plan

### Phase 1: Preparation (1-2 days)
1. Document current branch state and relationships
2. Obtain team agreement on new strategy
3. Create migration checklist and rollback plan
4. Update documentation (README, CONTRIBUTING, internal wiki)
5. Set up branch protection rules (dry run first)

### Phase 2: Branch Cleanup (1 day)
1. Merge deploy-v2 → dev (preserve deployment fixes)
2. Archive and delete unnecessary branches (build, temp, etc.)
3. Rename existing feature branches to feat/* pattern
4. Verify all active work is preserved

### Phase 3: OpenSpec Integration (2-3 days)
1. Add branch creation suggestion to `openspec propose`
2. Add branch validation to `openspec apply-change`
3. Add merge automation to `openspec archive-change`
4. Update OpenSpec documentation with git workflow

### Phase 4: CI/CD Updates (2-3 days)
1. Inventory all pipeline branch triggers
2. Update pipelines to recognize new branch names
3. Test updated pipelines thoroughly
4. Deploy pipeline changes

### Phase 5: Team Training (1 day)
1. Conduct workshop on new branching strategy
2. Provide cheat sheet for common operations
3. Update onboarding documentation
4. Q&A session and support setup

### Phase 6: Rollout
1. Start using new strategy for all new features
2. Monitor for 2 weeks, adjust as needed
3. Conduct retrospective after first release cycle
4. Celebrate successful migration

## Open Questions

1. **CI/CD Platform Specifics**: What specific CI/CD platform is being used? Need to research exact syntax for branch protection rules and pipeline triggers.

2. **Team Size and Distribution**: How many team members and what time zones? This affects training scheduling and support needs.

3. **Existing Feature Branches**: Are there other active feature branches besides feat/survey-email that need migration?

4. **Release Frequency**: What's the desired release cadence (weekly, biweekly, monthly)? This affects release process design.

5. **Hotfix Frequency**: How often do production hotfixes typically occur? This helps size the hotfix workflow importance.

6. **OpenSpec Tool Access**: Do all team members have access to modify OpenSpec tooling, or is that centralized? Affects integration approach.

7. **Branch Naming Exceptions**: Are there any legitimate exceptions to the feat/* naming convention (e.g., experiment/, spike/)?

8. **Monorepo Considerations**: Should backend and frontend have separate branching strategies, or should this apply uniformly? Currently proposing uniform approach.