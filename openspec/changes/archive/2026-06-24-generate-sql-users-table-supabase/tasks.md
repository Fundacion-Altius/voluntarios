## 1. Database Schema Update ✅

- [x] 1.1 Create and apply SQL script for complete user management system
- [x] 1.2 Set up roles table with admin, general, and nave roles
- [x] 1.3 Create user_roles junction table for role assignments
- [x] 1.4 Seed initial users with correct role assignments

## 2. Backend Integration for Supabase ✅

- [x] 2.1 Update Drizzle schema to match new Supabase tables
- [x] 2.2 Update User entity for Microsoft auth integration
- [x] 2.3 Modify supabaseUserRepository with role management methods
- [x] 2.4 Fix all imports to use proper path aliases

## 3. Replicate Frontend + MariaDB Pattern for Supabase ✅

- [x] 3.1 Microsoft OAuth already implemented (NextAuth + AzureAD)
- [x] 3.2 Role-based session management already working
- [x] 3.3 Contract filtering by role already implemented
- [x] 3.4 Update backend authController to sync Microsoft users with Supabase
- [x] 3.5 Modify session management to include Supabase user roles

## 4. Role-Based Access Control (Backend)

- [x] 4.1 Create role-checking middleware for Express routes
- [x] 4.2 Add role filtering to user endpoints (match frontend pattern)
- [x] 4.3 Implement admin-only route protection
- [x] 4.4 Add role management API endpoints (admin only)

## 5. Testing with pnpm dev:supa

- [x] 5.1 Test Supabase connection and basic CRUD operations
- [x] 5.2 Verify Microsoft OAuth → Supabase user sync works
- [x] 5.3 Test role assignments match frontend expectations
- [x] 5.4 Validate admin endpoints are properly protected
- [x] 5.5 Ensure frontend + backend role filtering consistency