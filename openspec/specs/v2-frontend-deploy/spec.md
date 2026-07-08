# Purpose
Deploy the voluntarios-front Next.js application to Vercel for the v2 release, connected to GitHub for automatic builds from the `deploy-v2` branch, with Azure AD authentication and production Supabase data.

## Requirements

### Requirement: Frontend deployed to Vercel from deploy-v2 branch
The system SHALL deploy voluntarios-front to Vercel using GitHub integration on branch `deploy-v2`.

#### Scenario: Vercel project configured for deploy-v2 branch
- **WHEN** Vercel project is created (`voluntarios-v2-front`) with `Fundacion-Altius/voluntarios-front`
- **THEN** the project SHALL use branch `deploy-v2` as the production branch
- **THEN** Vercel SHALL auto-build and deploy on every push to `deploy-v2`

#### Scenario: Build succeeds with Next.js framework preset
- **WHEN** Vercel builds the Next.js application
- **THEN** Vercel SHALL use the default Next.js build settings (auto-detected)
- **THEN** build SHALL complete successfully using `pnpm install` + `pnpm run build`

### Requirement: Frontend environment variables configured on Vercel
The system SHALL have all required environment variables configured in Vercel project settings.

#### Scenario: Required environment variables present
- **WHEN** Vercel project settings are inspected
- **THEN** the following variables SHALL be set:
  - `NEXTAUTH_URL=https://voluntarios-v2-front.vercel.app`
  - `NEXTAUTH_SECRET=<from env>`
  - `NEXT_PUBLIC_API_URL=https://voluntarios-v2-back.vercel.app`
  - `AZURE_AD_TENANT_ID`, `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`

#### Scenario: Azure AD login redirect URI configured
- **WHEN** user initiates Azure AD login
- **THEN** they SHALL be redirected to `https://voluntarios-v2-front.vercel.app/api/auth/callback/azure-ad`
- **THEN** the Azure AD app SHALL have this URI registered

### Requirement: Frontend accessible at Vercel domain
The system SHALL serve the frontend at `https://voluntarios-v2-front.vercel.app`.

#### Scenario: Homepage loads
- **WHEN** user navigates to `https://voluntarios-v2-front.vercel.app/`
- **THEN** the Next.js application SHALL load and render the contract wizard

#### Scenario: Authentication flow works
- **WHEN** user visits `/login` and completes Azure AD authentication
- **THEN** user SHALL be redirected back and logged into the admin dashboard

#### Scenario: Contract creation works end-to-end
- **WHEN** user fills contract form, signs, accepts legal terms, and submits
- **THEN** contract SHALL be saved to production Supabase
- **THEN** user SHALL see confirmation "Tu contrato se ha enviado"

### Requirement: Frontend communicates with backend via public URL
The system SHALL use the backend's public Vercel URL for API communication (internal networking not available on Hobby plan).

#### Scenario: API calls use public backend URL
- **WHEN** frontend makes API calls to backend
- **THEN** requests SHALL use `https://voluntarios-v2-back.vercel.app/api/*` via `NEXT_PUBLIC_API_URL`
- **THEN** CORS SHALL be properly configured for cross-origin communication
