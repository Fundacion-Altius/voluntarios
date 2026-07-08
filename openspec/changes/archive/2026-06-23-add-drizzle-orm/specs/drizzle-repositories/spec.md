## ADDED Requirements

### Requirement: MariaDB CRUD operations use Drizzle

The system SHALL replace the raw `mariadb` pool queries in `mariaDBRepository.ts` with Drizzle ORM queries for the `contratos` table. The existing function signature `(database?: string) => MariaDBRepository<DatosContrato>` SHALL be preserved for backward compatibility with the controller.

#### Scenario: Drizzle client is initialized for MariaDB

- **WHEN** the MariaDB repository module loads
- **THEN** it SHALL create a Drizzle client instance connected to the MariaDB pool

#### Scenario: getAll returns all contracts via Drizzle

- **WHEN** `getAll` is called
- **THEN** it SHALL execute `db.select().from(contratos)` using Drizzle instead of raw SQL

#### Scenario: getById returns a single contract via Drizzle

- **WHEN** `getById` is called with a valid id
- **THEN** it SHALL execute `db.select().from(contratos).where(eq(contratos.id, id))` using Drizzle

#### Scenario: create inserts a contract via Drizzle

- **WHEN** `create` is called with contract data
- **THEN** it SHALL execute `db.insert(contratos).values(values)` using Drizzle

#### Scenario: update modifies a contract via Drizzle

- **WHEN** `update` is called with an id and data
- **THEN** it SHALL execute `db.update(contratos).set(values).where(eq(contratos.id, id))` using Drizzle

#### Scenario: delete removes a contract via Drizzle

- **WHEN** `delete` is called with an id
- **THEN** it SHALL execute `db.delete(contratos).where(eq(contratos.id, id))` using Drizzle

### Requirement: Supabase CRUD operations use Drizzle

The system SHALL replace the raw Supabase client queries in `supabaseRepository.ts` with Drizzle ORM queries for all entity repositories (contratos, encuestas, preguntas, survey_answers, survey_submissions). The Drizzle client SHALL connect via the Supabase PostgreSQL connection.

#### Scenario: Drizzle client is initialized for Supabase PostgreSQL

- **WHEN** the Supabase repository module loads
- **THEN** it SHALL create a Drizzle client instance connected to Supabase's PostgreSQL database (using `postgres.js` or `pg` driver)

#### Scenario: Contract repository methods use Drizzle

- **WHEN** `supabaseContractRepository().getAll()` is called
- **THEN** it SHALL use `db.select().from(contratos)` instead of `supabase.from("contratos").select("*")`

#### Scenario: Survey repository methods use Drizzle

- **WHEN** `supabaseSurveyRepository().getAll()` is called
- **THEN** it SHALL use `db.select().from(encuestas)` instead of `supabase.from("encuestas").select("*")`

#### Scenario: Question repository methods use Drizzle

- **WHEN** `supabaseQuestionRepository().getAll()` is called
- **THEN** it SHALL use `db.select().from(preguntas)` instead of `supabase.from("preguntas").select("*")`

#### Scenario: Survey answer repository methods use Drizzle

- **WHEN** `supabaseSurveyAnswerRepository().getAll()` is called
- **THEN** it SHALL use `db.select().from(surveyAnswers)` instead of `supabase.from("survey_answers").select("*")`

#### Scenario: Survey submission repository methods use Drizzle

- **WHEN** `supabaseSurveySubmissionRepository().getAll()` is called
- **THEN** it SHALL use `db.select().from(surveySubmissions)` instead of `supabase.from("survey_submissions").select("*")`

#### Scenario: Supabase RPC function is preserved

- **WHEN** the `getReport` method is called on the survey repository
- **THEN** it SHALL still execute the `get_survey_report` RPC function via the Supabase client (Supabase RPCs are not replaced by Drizzle)

### Requirement: In-memory repositories remain unchanged

The in-memory repositories (used for development and tests) SHALL NOT be migrated to Drizzle. They SHALL continue using plain arrays and the existing functional pattern. The existing TypeScript entity types (which will be replaced by Drizzle-generated types) SHALL still import from a shared type source.

#### Scenario: InMemoryContractRepository still works

- **WHEN** `NODE_ENV=development` and a contract is queried
- **THEN** the in-memory repository SHALL return results from its internal array, using Drizzle-generated types for the entity shape
