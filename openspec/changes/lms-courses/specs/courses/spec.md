## ADDED Requirements

### Requirement: Admin can create courses with modules and lessons

The system SHALL support a hierarchical course structure: Course → Module (ordered) → Lesson (ordered).

#### Scenario: Create course
- **WHEN** an authenticated admin/staff sends `POST /api/courses` with title, description, level, category, and optional image_url
- **THEN** the system SHALL create a course and return its ID
- **THEN** the course SHALL have `status` set to `"draft"`

#### Scenario: Update course
- **WHEN** an admin sends `PUT /api/courses/:id` with updated fields
- **THEN** the system SHALL update the course

#### Scenario: Publish/unpublish course
- **WHEN** an admin sends `PUT /api/courses/:id` with `status: "published"`
- **THEN** the course SHALL become visible in the volunteer catalog
- **WHEN** an admin sets `status: "draft"`
- **THEN** the course SHALL be hidden from the catalog

#### Scenario: Delete course
- **WHEN** an admin sends `DELETE /api/courses/:id`
- **THEN** the system SHALL cascade-delete all modules, lessons, and enrollments

#### Scenario: Add module to course
- **WHEN** an admin sends `POST /api/courses/:courseId/modules` with title, description, and optional order
- **THEN** the module SHALL be created and associated with the course

#### Scenario: Reorder modules
- **WHEN** an admin sends `PUT /api/courses/:courseId/modules/reorder` with an array of module IDs in the desired order
- **THEN** the system SHALL update the `order` field for each module

#### Scenario: Add lesson to module
- **WHEN** an admin sends `POST /api/courses/:courseId/modules/:moduleId/lessons` with title, content_type (`text`|`video`|`quiz`), and content
- **THEN** the lesson SHALL be created
- **THEN** if content_type is `"text"`, `content` SHALL store HTML
- **THEN** if content_type is `"video"`, `content_url` SHALL store the embed URL
- **THEN** if content_type is `"quiz"`, `content` SHALL store a JSON array of `{ question, options: string[], correctIndex: number }`

### Requirement: Volunteers can browse course catalog

The system SHALL expose a read-only catalog of published courses for authenticated volunteers.

#### Scenario: List published courses
- **WHEN** an authenticated user sends `GET /api/courses?status=published`
- **THEN** the system SHALL return paginated courses with title, description, image_url, level, category, and lesson count
- **THEN** if the user is enrolled, enrollment status and progress_pct SHALL be included

#### Scenario: Filter courses by category
- **WHEN** an authenticated user sends `GET /api/courses?category=formacion`
- **THEN** the system SHALL filter courses by that category

#### Scenario: Get course detail
- **WHEN** an authenticated user sends `GET /api/courses/:id`
- **THEN** the system SHALL return the full course with modules and lessons (but not quiz answers for non-staff)
