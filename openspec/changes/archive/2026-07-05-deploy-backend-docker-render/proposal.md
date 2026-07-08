## Why

Deploy the voluntarios-back backend service via Docker to Render.com to enable production hosting and continuous deployment. This will provide a scalable, managed hosting solution for the volunteer management system, allowing it to be accessible to users 24/7 with proper monitoring and automatic deployments.

## What Changes

- Create Dockerfile and docker-compose.yml for backend deployment
- Configure Render.com service with Docker deployment
- Set up environment variables and secrets management for production
- Implement CI/CD pipeline for automatic deployments to Render.com
- Add health checks and monitoring endpoints
- Configure database connection for production Postgres

## Capabilities

### New Capabilities
- `docker-deployment`: Docker containerization for backend service
- `render-hosting`: Render.com hosting configuration and deployment
- `production-monitoring`: Health checks and monitoring endpoints
- `ci-cd-pipeline`: Automated deployment pipeline to Render.com

### Modified Capabilities
- None (this is a new deployment capability, not modifying existing functionality)

## Status

This change is superseded by the decision to deploy the backend to Vercel instead of Render. All tasks are boxed as irrelevant. The `v2-deploy-back-vercel` change covers the Vercel deployment path.

Archived: 2026-07-05

## Impact

- Backend service (`voluntarios-back/`) - new Docker configuration files
- Deployment configuration - new Render.com service setup
- CI/CD workflows - new GitHub Actions or similar pipeline
- Environment variables - new production configuration
- Database configuration - production Postgres connection setup