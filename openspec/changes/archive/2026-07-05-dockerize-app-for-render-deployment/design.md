## Context

The Voluntarios application is a monorepo with two independent packages: `voluntarios-back` (Express + TypeScript backend) and `voluntarios-front` (Next.js 14 frontend). Currently, deployment requires manual setup of Node.js environments and dependencies. Render.com requires containerized applications for production deployment.

## Goals / Non-Goals

**Goals:**
- Create production-ready Docker configurations for both frontend and backend
- Enable seamless deployment to Render.com
- Provide local development workflow using Docker containers
- Optimize Docker images for production (small size, fast startup)
- Maintain parity between local Docker development and production environments

**Non-Goals:**
- Kubernetes orchestration or complex container orchestration
- Multi-region deployment strategies
- CI/CD pipeline automation (beyond basic Docker build)
- Container security hardening beyond Render's baseline requirements

## Decisions

### Multi-stage Docker builds
**Decision**: Use multi-stage builds for both frontend and backend to minimize production image size.
**Rationale**: Multi-stage builds allow us to include build dependencies in the build stage while keeping only runtime essentials in the final image. This reduces attack surface and deployment time.
**Alternatives considered**: Single-stage builds (simpler but larger images), distroless images (more secure but harder to debug).

### Separate Dockerfiles for frontend and backend
**Decision**: Create separate Dockerfiles for `voluntarios-front` and `voluntarios-back` rather than a single monorepo Dockerfile.
**Rationale**: The frontend (Next.js) and backend (Express) have different build requirements and runtime environments. Separate Dockerfiles provide better optimization for each technology stack.
**Alternatives considered**: Monorepo Dockerfile with build stages for both (more complex, less flexible).

### Node.js version pinning
**Decision**: Pin Node.js version to LTS (v20.x) in Dockerfiles to match current development environment.
**Rationale**: Ensures consistency between development, staging, and production environments. LTS provides stability and long-term support.
**Alternatives considered**: Using "node:latest" (risk of breaking changes), specific patch version (too rigid for security updates).

### Docker Compose for local development
**Decision**: Provide docker-compose.yml that includes all services (backend, frontend, Postgres, Redis) for local development.
**Rationale**: Simplifies local setup and ensures development environment matches production architecture. Developers can start the entire stack with one command.
**Alternatives considered**: Individual container startup scripts (more complex), no compose file (poorer developer experience).

### Environment variable strategy
**Decision**: Use .env files for development and Docker build arguments/environment variables for production configuration.
**Rationale**: Separates development convenience from production security. Build arguments allow different configurations without rebuilding images.
**Alternatives considered**: Baking all config into images (insecure), complex config management systems (overkill for current needs).

### Render-specific optimization
**Decision**: Create a Render-optimized configuration with health check endpoints and proper process management.
**Rationale**: Render has specific requirements for container health checks and process signaling. Optimizing for Render ensures reliable deployments.
**Alternatives considered**: Generic cloud-agnostic configuration (would require manual tuning for Render).

## Risks / Trade-offs

**[Docker build complexity]** → Mitigation: Document build process thoroughly and provide helper scripts for common operations.

**[Increased image size with Node.js base images]** → Mitigation: Use alpine variants where possible and implement multi-stage builds to strip unnecessary layers.

**[Local development performance overhead]** → Mitigation: Provide alternative non-Docker development setup in documentation for developers who prefer native Node.js.

**[Render-specific configuration may not work on other platforms]** → Mitigation: Clearly document Render-specific elements and provide guidance for adapting to other platforms.

**[Container networking complexity in development]** → Mitigation: Use docker-compose networking with clear service names and document the network architecture.

## Migration Plan

1. **Phase 1 - Docker Configuration**: Create Dockerfiles, docker-compose.yml, and .dockerignore files
2. **Phase 2 - Local Testing**: Validate Docker setup works locally with full application stack
3. **Phase 3 - Render Preparation**: Configure Render-specific settings (health checks, environment variables)
4. **Phase 4 - Documentation**: Update README with Docker setup and deployment instructions
5. **Phase 5 - Deployment**: Deploy to Render staging environment, test, then promote to production

**Rollback Strategy**: Maintain traditional deployment method (manual Node.js setup) as fallback during transition period. Keep both deployment methods documented until Docker deployment is fully validated.

## Open Questions

- Should we implement Docker-based CI/CD pipeline as part of this change or leave it for future work?
- What monitoring and logging configuration is needed specifically for Render deployment?
- Should we include database migration handling in the Docker setup or keep it separate?