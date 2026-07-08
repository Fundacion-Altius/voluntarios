## Why

Currently, the backend authentication system returns the auth token as a property in the response body, which is not secure. Storing tokens in HTTP-only cookies is a security best practice that helps prevent XSS (Cross-Site Scripting) attacks by making the token inaccessible to JavaScript.

## What Changes

- Modify the authentication response to store the auth token in an HTTP-only cookie instead of returning it in the response body
- Update login and token refresh endpoints to use cookie-based token storage
- Ensure proper cookie security settings (Secure, HttpOnly, SameSite attributes)
- Update frontend to work with cookie-based authentication instead of storing tokens in memory/localStorage

## Capabilities

### New Capabilities
- `cookie-based-auth`: Secure authentication token storage using HTTP-only cookies
- `auth-cookie-management`: Management of authentication cookies including creation, validation, and expiration

### Modified Capabilities
- `user-authentication`: Update authentication flow to use cookie-based token storage instead of response body tokens

## Impact

- Backend: Authentication endpoints in `voluntarios-back/` (login, token refresh)
- Frontend: Authentication state management in `voluntarios-front/`
- Security: Improved protection against XSS attacks
- API: Changes to authentication response format (breaking change for clients expecting token in response body)
