## Context

The current authentication system returns JWT tokens in the response body, which exposes them to XSS attacks. We need to implement secure cookie-based token storage following security best practices. The system currently uses Express.js on the backend and Next.js on the frontend.

## Goals / Non-Goals

**Goals:**
- Store authentication tokens in HTTP-only cookies instead of response body
- Implement proper cookie security settings (Secure, HttpOnly, SameSite)
- Maintain backward compatibility where possible
- Ensure CSRF protection for cookie-based authentication
- Update both backend and frontend to work with the new system

**Non-Goals:**
- Changing the token format or JWT structure
- Implementing session management beyond token storage
- Supporting multiple authentication methods simultaneously
- Changing the authentication flow logic (just the token storage mechanism)

## Decisions

### Cookie Storage vs Response Body
**Decision**: Use HTTP-only cookies for token storage
**Rationale**: HTTP-only cookies are not accessible via JavaScript, protecting against XSS attacks. They also provide built-in security attributes and automatic handling by browsers.
**Alternatives considered**: 
- LocalStorage: Vulnerable to XSS
- SessionStorage: Cleared when tab closes, vulnerable to XSS
- Response body: Current approach, vulnerable to XSS

### Cookie Security Attributes
**Decision**: Use Secure, HttpOnly, SameSite=Lax attributes
**Rationale**: 
- `Secure`: Only send over HTTPS
- `HttpOnly`: Not accessible to JavaScript
- `SameSite=Lax`: Good balance between security and usability
**Alternatives considered**: 
- SameSite=Strict: Too restrictive for some use cases
- SameSite=None: Less secure, requires Secure attribute

### CSRF Protection
**Decision**: Implement CSRF tokens for state-changing requests
**Rationale**: Cookie-based auth is vulnerable to CSRF. We'll use double-submit cookie pattern or sync token pattern.
**Alternatives considered**: 
- SameSite cookies alone: Not sufficient for all browsers
- Custom headers: Less compatible with some clients

### Token Refresh Mechanism
**Decision**: Continue using refresh tokens but store them in separate secure cookies
**Rationale**: Maintains security while allowing token rotation. Refresh tokens need same protection as access tokens.

## Risks / Trade-offs

**[Risk] Cookie size limits**: JWT tokens can be large, potentially hitting cookie size limits (4KB)
→ **Mitigation**: Keep JWT payload minimal, consider shorter token lifetimes

**[Risk] CSRF vulnerability**: Cookie-based auth without proper protection is vulnerable to CSRF
→ **Mitigation**: Implement CSRF tokens for all state-changing requests

**[Risk] Backward compatibility**: Existing clients expect token in response body
→ **Mitigation**: Provide migration period with both methods, clear documentation

**[Risk] CORS complexity**: Cookie handling with CORS requires proper configuration
→ **Mitigation**: Ensure proper CORS headers, credentials mode in fetch requests

**[Risk] Token revocation**: Cookies can be harder to revoke than in-memory tokens
→ **Mitigation**: Implement short token lifetimes with refresh mechanism

## Migration Plan

1. **Phase 1 - Backend Implementation**:
   - Add cookie-based token storage alongside current response body method
   - Implement CSRF protection
   - Update token refresh endpoint

2. **Phase 2 - Frontend Update**:
   - Update login flow to handle cookies
   - Implement CSRF token handling
   - Update API clients to work with cookies

3. **Phase 3 - Deprecation**:
   - Deprecate response body token method
   - Update documentation
   - Remove legacy code after migration period

4. **Rollback Strategy**:
   - Feature flag to revert to response body tokens
   - Database backup of auth-related data
   - Monitor error rates and performance

## Open Questions

- Should we implement token rotation for enhanced security?
- What's the optimal token lifetime balance between security and UX?
- Do we need to support multiple concurrent sessions per user?
- Should refresh tokens have different security attributes than access tokens?
