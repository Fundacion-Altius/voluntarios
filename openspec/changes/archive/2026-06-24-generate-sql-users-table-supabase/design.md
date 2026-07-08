## Context

The frontend + MariaDB setup is already working with Microsoft OAuth (NextAuth + AzureAD), role-based session management, and contract filtering by role. We need to replicate this exact pattern for the Supabase backend to ensure consistency across environments.

## Goals / Non-Goals

**Goals:**
- Replicate frontend + MariaDB authentication pattern for Supabase
- Synchronize Microsoft user data with Supabase on login (match MariaDB behavior)
- Ensure role assignments are consistent between MariaDB and Supabase
- Maintain identical API responses for frontend compatibility
- Preserve existing Microsoft OAuth and NextAuth implementation

**Non-Goals:**
- Modify existing frontend authentication (NextAuth + AzureAD)
- Change the role filtering logic in frontend
- Implement additional authentication providers
- Create new authentication flows

## Decisions

### Database Schema (Already Implemented ✅)
- Users table in Supabase mirrors MariaDB structure
- Roles table for permission management (same as MariaDB)
- User_roles junction table for role assignments (same as MariaDB)
- UUIDs for primary keys (consistent with MariaDB)
- Microsoft user IDs stored for reference (same pattern)

### Integration Approach - Replicate MariaDB Pattern
- Keep existing NextAuth + AzureAD implementation unchanged
- Add Supabase synchronization to match MariaDB behavior
- On Microsoft login: create/update user in Supabase (same as MariaDB)
- Role assignment logic must match MariaDB implementation
- API responses must be identical to MariaDB endpoints

### Role Management - Match Frontend Expectations
- Three roles: admin, general, nave (same as frontend)
- Role-based access control at Express middleware level
- Store role assignments in database for persistence
- Admin endpoints must match frontend expectations
- Session role caching must work identically

### Data Synchronization Strategy
- On first Microsoft login: create user in Supabase with default role (match MariaDB)
- On subsequent logins: update user data if changed (match MariaDB)
- Use Microsoft ID as unique identifier (same as MariaDB)
- Implement idempotent operations (prevent duplicates)

## Key Patterns to Replicate

### 1. Frontend Role Filtering (Already Working)
```typescript
// From mariaDBRepository.ts - must work identically with Supabase
getAllFilteredByRole: async (role: string): Promise<DatosContrato[]> => {
  if (role === 'admin') return all contracts;
  if (role === 'nave') return contracts with "Nave" area;
  if (role === 'general') return contracts without "Nave" area;
}
```

### 2. Session Management (Already Working)
```typescript
// From NextAuth - must preserve exact session structure
session: {
  user: {
    email: string,
    name: string,
    role: 'admin' | 'general' | 'nave',  // Must match Supabase roles
    accessToken: string
  }
}
```

### 3. API Response Format (Must Match)
```json
// All user endpoints must return identical JSON structure
{
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string", 
    "role": "admin" | "general" | "nave"
  },
  "token": "jwt"
}
```

## Risks / Trade-offs

**Consistency Risks**: 
- [Risk] Role filtering differences between MariaDB and Supabase → Mitigation: Use identical SQL patterns
- [Risk] Session structure mismatches → Mitigation: Preserve exact NextAuth session format

**Integration Risks**:
- [Risk] API response format differences → Mitigation: Test endpoints side-by-side
- [Risk] Role assignment logic differences → Mitigation: Reuse MariaDB business logic

## Implementation Strategy

```
Frontend (NextAuth + AzureAD) 
  ↓ (identical for both backends)
MariaDB Backend (working) ← Replicate → Supabase Backend (target)
  ↓ (must produce identical responses)
Identical API Contracts → Consistent Frontend Experience
```

## Testing Approach

1. **Side-by-side Testing**: Run both backends and compare responses
2. **Session Consistency**: Verify NextAuth sessions work identically
3. **Role Filtering**: Ensure contract filtering produces same results
4. **API Compatibility**: Validate all endpoints return identical JSON