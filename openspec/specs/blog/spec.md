## ADDED Requirements

### Requirement: Admin can manage blog posts

The system SHALL provide CRUD endpoints for blog posts, restricted to admin/staff users.

#### Scenario: Create blog post
- **WHEN** an authenticated admin sends `POST /api/blog/posts` with title, excerpt, body, category_id, and optional image_url
- **THEN** the system SHALL create a new blog post and return it with `published_at` set to null (draft status)

#### Scenario: Publish blog post
- **WHEN** an admin sends `PUT /api/blog/posts/:id` with `published_at` set
- **THEN** the system SHALL set `published_at` to the given timestamp
- **THEN** the post SHALL become visible in the public feed

#### Scenario: List blog posts (admin)
- **WHEN** an authenticated admin sends `GET /api/blog/posts?status=all`
- **THEN** the system SHALL return paginated posts including drafts

#### Scenario: Delete blog post
- **WHEN** an admin sends `DELETE /api/blog/posts/:id`
- **THEN** the system SHALL soft-delete or hard-delete the post

### Requirement: Volunteers can read blog feed

The system SHALL expose a read-only feed of published posts for authenticated volunteers.

#### Scenario: List published posts
- **WHEN** an authenticated user sends `GET /api/blog/posts?status=published`
- **THEN** the system SHALL return only posts where `published_at` is not null, ordered by `published_at` descending, with pagination

#### Scenario: Get single post
- **WHEN** an authenticated user sends `GET /api/blog/posts/:id`
- **THEN** the system SHALL return the full post body and metadata

#### Scenario: Filter by category
- **WHEN** an authenticated user sends `GET /api/blog/posts?category=eventos`
- **THEN** the system SHALL filter posts by that category slug

### Requirement: Blog posts have categories

The system SHALL support categorizing blog posts.

#### Scenario: Seed default categories
- **WHEN** the system starts or migration runs
- **THEN** three categories SHALL exist: `noticias`, `eventos`, `formacion`

#### Scenario: Admin manages categories
- **WHEN** an admin sends POST/PUT/DELETE to `/api/blog/categories`
- **THEN** the system SHALL create/update/delete categories accordingly

### Requirement: Blog feed visible in portal

The volunteer portal SHALL display a news feed tab showing published blog posts.

#### Scenario: Portal shows news tab
- **WHEN** a volunteer navigates to `/portal`
- **THEN** the portal SHALL display a "Noticias" section or tab with the 5 most recent published posts
- **THEN** clicking "Ver más" SHALL navigate to a `/portal/noticias` page with the full paginated feed
