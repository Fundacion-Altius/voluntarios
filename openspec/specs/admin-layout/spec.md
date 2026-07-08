# Admin Layout

## Purpose

Provide a shared responsive layout for all admin pages with sidebar navigation, top bar, and auth guard.

## Requirements

### Requirement: Admin pages share a layout with a responsive sidebar
The system SHALL provide a shared layout for all admin pages with a left sidebar that contains navigation links.

#### Scenario: Sidebar is visible on desktop by default
- **WHEN** an admin user navigates to any admin page on a desktop viewport (>768px)
- **THEN** the sidebar SHALL be visible and open by default with a width of approximately 240px

#### Scenario: Sidebar is collapsible via drag handle
- **WHEN** an admin user drags the right edge of the sidebar to the left past a threshold (~80px remaining width)
- **THEN** the sidebar SHALL snap to an icon-only state (~64px wide) showing only navigation icons without labels

#### Scenario: Sidebar expands back from icon-only state via drag
- **WHEN** the sidebar is in icon-only state and the user drags the right edge to the right past the threshold
- **THEN** the sidebar SHALL expand back to full width

#### Scenario: Sidebar is hidden on mobile by default
- **WHEN** an admin user navigates to any admin page on a mobile viewport (<768px)
- **THEN** the sidebar SHALL be hidden by default

#### Scenario: Sidebar opens via hamburger button on mobile
- **WHEN** a mobile user taps the hamburger icon in the top bar
- **THEN** the sidebar SHALL slide in as an overlay on top of the page content

#### Scenario: Sidebar closes on backdrop click on mobile
- **WHEN** the sidebar is open as an overlay on mobile
- **THEN** tapping the backdrop content SHALL close the sidebar

#### Scenario: Sidebar contains navigation links
- **WHEN** the sidebar is rendered
- **THEN** it SHALL contain navigation items for Dashboard, Contratos, Usuarios, and Encuestas
- **AND** each item SHALL have an icon and a label

#### Scenario: Active route is highlighted in sidebar
- **WHEN** a sidebar navigation item matches the current route
- **THEN** that item SHALL be visually highlighted (active state)

#### Scenario: Sidebar is keyboard accessible
- **WHEN** a keyboard user tabs into the sidebar
- **THEN** all navigation links SHALL be focusable
- **AND** the sidebar SHALL have appropriate ARIA attributes (`role="navigation"`, `aria-expanded`)

### Requirement: Admin layout protects routes with auth guard
The system SHALL redirect unauthenticated users to the login page when accessing admin routes.

#### Scenario: Unauthenticated user is redirected
- **WHEN** an unauthenticated user attempts to access any admin page
- **THEN** they SHALL be redirected to `/login`

#### Scenario: Authenticated non-admin user sees the layout
- **WHEN** an authenticated user with any role accesses an admin page
- **THEN** the layout SHALL render

### Requirement: Admin layout has a top bar
The admin layout SHALL render a top bar with branding, theme toggle, user info, and logout.

#### Scenario: Top bar shows user info
- **WHEN** the admin layout renders
- **THEN** the top bar SHALL display the user's name, email, and a logout button
- **AND** a theme toggle SHALL be visible
- **AND** on mobile a hamburger icon SHALL be visible
