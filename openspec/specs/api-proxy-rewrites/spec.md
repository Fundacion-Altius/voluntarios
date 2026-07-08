# Purpose
Configure direct frontend-to-backend API communication on Vercel, eliminating Next.js proxy rewrites by pointing `NEXT_PUBLIC_API_URL` at the backend's public URL.

## Requirements

### Requirement: Direct frontend-to-backend API calls
The system SHALL make direct API calls from the Next.js frontend to the Express backend hosted as a separate Vercel service.

#### Scenario: Frontend configured with backend URL
- **WHEN** frontend initializes
- **THEN** it SHALL read backend URL from `process.env.NEXT_PUBLIC_API_URL`
- **THEN** all API calls SHALL be made directly to that URL without proxy rewrites

#### Scenario: CORS configured for cross-origin requests
- **WHEN** frontend at `*.vercel.app` makes API calls to backend at `*.vercel.app`
- **THEN** backend SHALL respond with appropriate `access-control-allow-origin` header
- **THEN** CORS preflight (OPTIONS) requests SHALL return 204

#### Scenario: Cookies work across services
- **WHEN** authenticated request is made from frontend to backend
- **THEN** cookies SHALL be included (credentials: "include")
- **THEN** backend SHALL validate cookies correctly

### Requirement: assetPrefix removed from Next.js config
The system SHALL NOT use `assetPrefix` in production Next.js configuration since Vercel serves from root domain.

#### Scenario: No assetPrefix in production build
- **WHEN** `next build` runs on Vercel
- **THEN** `assetPrefix` SHALL be undefined or empty string
- **THEN** static assets SHALL be served from `/` not `/voluntarios/`

### Requirement: Simplified Next.js configuration
The system SHALL use a simplified Next.js configuration optimized for Vercel deployment without rewrites.

#### Scenario: Clean next.config.ts without rewrite complexity
- **WHEN** `next.config.ts` is inspected
- **THEN** it SHALL NOT contain complex rewrite logic
- **THEN** configuration SHALL rely on `NEXT_PUBLIC_API_URL` for backend communication
