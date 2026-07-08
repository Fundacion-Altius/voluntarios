## Purpose

Update all code paths that select repositories to use the new Postgres Drizzle repos for staging and production, replacing hardcoded Supabase REST and MariaDB selections.

## Requirements

### Requirement: Repository factory returns Postgres repos for staging and production

The `repositoryFactory.ts` SHALL return Postgres Drizzle repos when `NODE_ENV` is `staging` or `production`.

#### Scenario: Factory returns PG repos
- **WHEN** `NODE_ENV=staging`
- **THEN** `getSurveyRepository()`, `getQuestionRepository()`, `getSurveyAnswerRepository()`, `getSurveySubmissionRepository()` SHALL return Postgres Drizzle repos
- **AND** when `NODE_ENV=production`, the same functions SHALL also return Postgres Drizzle repos

### Requirement: Contract controller uses factory pattern

The `contractController.ts` SHALL use the repository factory instead of inline env-based selection.

#### Scenario: Contract repo via factory
- **WHEN** `NODE_ENV=staging`
- **THEN** `contractController` SHALL obtain the contract repo from a factory function
- **AND** when `NODE_ENV=production`, the same SHALL return a Postgres Drizzle repo

### Requirement: Auth and user controllers use factory pattern

The `authController.ts`, `userController.ts`, and `authMiddleware.ts` SHALL obtain their repos from a factory instead of hardcoding `supabaseUserRepository()`.

#### Scenario: User repo via factory
- **WHEN** the auth middleware checks a user
- **THEN** it SHALL call a factory function to get the user repo
- **AND** the factory SHALL return the correct repo based on `NODE_ENV`

### Requirement: Supabase REST repos are removed

Once all consumers use the factory, the `src/infra/supabase/supabaseRepository.ts` file SHALL be deleted.

#### Scenario: Supabase repos deleted
- **WHEN** all controllers are migrated to the factory
- **THEN** `src/infra/supabase/` SHALL be removed
- **AND** the `@supabase/supabase-js` dependency SHALL be removed from `package.json` if no longer needed
