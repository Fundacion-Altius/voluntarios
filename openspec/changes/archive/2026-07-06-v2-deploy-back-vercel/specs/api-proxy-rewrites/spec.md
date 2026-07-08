## ADDED Requirements

### Requirement: Direct service communication via Vercel internal networking
The system SHALL use Vercel's internal service networking for direct communication between frontend and backend services, eliminating the need for API proxy rewrites or CORS configuration.

#### Scenario: Frontend configured to use internal backend URL
- **WHEN** frontend makes API calls
- **THEN** it SHALL use Vercel internal service URL for backend
- **THEN** API calls SHALL be made directly to backend service without proxy

#### Scenario: Environment variables configure backend URL
- **WHEN** frontend initializes
- **THEN** it SHALL read backend URL from `process.env.NEXT_PUBLIC_API_URL`
- **THEN** it SHALL use Vercel's internal service discovery to resolve backend URL

#### Scenario: API calls use private network
- **WHEN** frontend calls backend API
- **THEN** request SHALL traverse Vercel's private network
- **THEN** no public internet routing SHALL be required

#### Scenario: Cookies work with direct calls
- **WHEN** authenticated request is made to backend
- **THEN** cookies SHALL be included in the request
- **THEN** backend SHALL receive and validate cookies correctly

### Requirement: assetPrefix removed from Next.js config
The system SHALL NOT use `assetPrefix` in production Next.js configuration since Vercel serves from root domain.

#### Scenario: No assetPrefix in production build
- **WHEN** `next build` runs on Vercel
- **THEN** `assetPrefix` SHALL be undefined or empty string
- **THEN** static assets SHALL be served from `/` not `/voluntarios/`

#### Scenario: Static assets load correctly
- **WHEN** frontend loads on `https://voluntarios-v2.vercel.app`
- **THEN** all `_next/static/*` and `public/*` assets SHALL load from correct paths

### Requirement: Simplified Next.js configuration
The system SHALL use a simplified Next.js configuration optimized for Vercel deployment without the complexity of proxy rewrites.

#### Scenario: Clean next.config.ts without rewrite complexity
- **WHEN** `next.config.ts` is inspected
- **THEN** it SHALL NOT contain complex rewrite logic
- **THEN** configuration SHALL be optimized for Vercel's native features

#### Scenario: Standard Next.js build works on Vercel
- **WHEN** Vercel builds the Next.js application
- **THEN** build SHALL complete using standard Next.js preset
- **THEN** no custom build configuration SHALL be required