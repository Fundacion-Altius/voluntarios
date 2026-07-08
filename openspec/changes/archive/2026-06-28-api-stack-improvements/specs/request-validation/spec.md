## ADDED Requirements

### Requirement: Zod schemas for all API inputs
The backend SHALL define Zod schemas for all API request bodies, query parameters, and path parameters. Schemas SHALL be defined in `src/schemas/` organized by domain (auth, user, contract, survey, pdf).

#### Scenario: Schema exists for contract creation
- **WHEN** a developer looks at `src/schemas/contract.schema.ts`
- **THEN** they SHALL find a Zod schema `createContractSchema` validating all fields of `DatosContrato`

#### Scenario: Schema exists for user creation
- **WHEN** a developer looks at `src/schemas/user.schema.ts`
- **THEN** they SHALL find a Zod schema `createUserSchema` validating email, name, role

#### Scenario: Schema exists for auth login
- **WHEN** a developer looks at `src/schemas/auth.schema.ts`
- **THEN** they SHALL find a Zod schema `loginSchema` validating email and password

### Requirement: Reusable validation middleware
The backend SHALL provide a reusable Express middleware factory `validate(schema, source)` that validates `req.body`, `req.query`, or `req.params` against a Zod schema.

#### Scenario: Valid body passes middleware
- **WHEN** a request with valid body hits a route using `validate(createContractSchema)`
- **THEN** the middleware SHALL call `next()` and SHALL set `req.body` to the parsed (and possibly transformed) data

#### Scenario: Invalid body returns 400 with field errors
- **WHEN** a request with invalid body hits the validation middleware
- **THEN** the middleware SHALL return a 400 response with `{ errors: { fieldName: ["error message"] } }`

#### Scenario: Query parameter validation
- **WHEN** a route uses `validate(paginationSchema, 'query')`
- **THEN** the middleware SHALL validate `req.query` against the schema and parse defaults (e.g., `page` defaults to 1)

### Requirement: Existing manual validation replaced
All existing manual validation in `src/utils.ts` (`validateDatosContrato`) and inline in controllers SHALL be replaced with Zod middleware usage.

#### Scenario: Contract controller uses Zod middleware
- **WHEN** `contractController.createContract` is called
- **THEN** the route SHALL use `validate(createContractSchema)` instead of calling `validateDatosContrato` manually

## MODIFIED Requirements

(none)
