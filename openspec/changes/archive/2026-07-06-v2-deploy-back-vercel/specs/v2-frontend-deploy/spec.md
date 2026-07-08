## ADDED Requirements

### Requirement: Frontend deployed to Vercel from deploy-v2 branch
The system SHALL deploy the voluntarios-front application to Vercel using the `deploy-v2` branch as the deployment source. Vercel SHALL automatically build and deploy on every push to `deploy-v2`.

#### Scenario: Vercel project configured for deploy-v2 branch
- **WHEN** Vercel project is created with GitHub repository `Fundacion-Altius/voluntarios-front`
- **THEN** the project SHALL use branch `deploy-v2` as the production branch

#### Scenario: Automatic build on push
- **WHEN** code is pushed to `deploy-v2` branch
- **THEN** Vercel SHALL automatically trigger a build using `pnpm run build` and deploy the output

#### Scenario: Build succeeds with Next.js framework preset
- **WHEN** Vercel detects Next.js framework
- **THEN** Vercel SHALL use the default Next.js build settings (output directory `.next`, install command `pnpm install`)

### Requirement: Frontend environment variables configured on Vercel
The system SHALL have all required environment variables configured in Vercel project settings for the v2 deployment.

#### Scenario: Required environment variables present
- **WHEN** Vercel project settings are inspected
- **THEN** the following variables SHALL be set:
  - `NEXTAUTH_URL=https://voluntarios-v2.vercel.app`
  - `NEXTAUTH_SECRET=<same as production>`
  - `AZURE_AD_TENANT_ID=<from .env.test>`
  - `AZURE_AD_CLIENT_ID=<from .env.test>`
  - `AZURE_AD_CLIENT_SECRET=<from .env.test>`
  - `NEXT_PUBLIC_API_URL=<vercel-internal-backend-url>` (using Vercel service discovery)
  - `API_URL=<vercel-internal-backend-url>` (using Vercel service discovery)

#### Scenario: Vercel-specific variables override .env files
- **WHEN** Vercel builds the project
- **THEN** Vercel environment variables SHALL take precedence over any `.env.*` files in the repository

### Requirement: Frontend accessible at Vercel domain
The system SHALL serve the frontend at the Vercel-assigned domain (`voluntarios-v2.vercel.app` or custom domain).

#### Scenario: Homepage loads
- **WHEN** user navigates to `https://voluntarios-v2.vercel.app/`
- **THEN** the Next.js application SHALL load and render the contract wizard

#### Scenario: Authentication flow works
- **WHEN** user clicks login and completes Azure AD authentication
- **THEN** user SHALL be redirected back to `https://voluntarios-v2.vercel.app/api/auth/callback/azure-ad` and logged in

### Requirement: Frontend communicates with backend via Vercel internal networking
The system SHALL use Vercel's internal service networking for frontend-to-backend communication.

#### Scenario: API calls use internal service URLs
- **WHEN** frontend makes API calls to backend
- **THEN** requests SHALL be sent to Vercel internal service URL
- **THEN** no public internet routing SHALL be required

#### Scenario: Private network communication
- **WHEN** frontend calls backend API endpoints
- **THEN** communication SHALL occur over Vercel's private network
- **THEN** latency SHALL be minimized compared to public internet routing