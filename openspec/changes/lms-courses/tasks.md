## 1. Database Schema

- [ ] 1.1 Create `courses` Drizzle PG table (id, title, description, image_url, level, category, status, created_by FK, created_at, updated_at)
- [ ] 1.2 Create `modules` Drizzle PG table (id, course_id FK, title, description, order, created_at)
- [ ] 1.3 Create `lessons` Drizzle PG table (id, module_id FK, title, content_type, content, content_url, order, created_at)
- [ ] 1.4 Create `enrollments` Drizzle PG table (id, user_id FK, course_id FK, status, progress_pct, completed_at, created_at)
- [ ] 1.5 Create `lesson_progress` Drizzle PG table (id, user_id FK, lesson_id FK, completed_at, created_at)
- [ ] 1.6 Add `courses` to Drizzle schema barrel (`src/db/schema/pg/index.ts`)
- [ ] 1.7 Add all LMS types to `src/db/types.ts`
- [ ] 1.8 Run `pnpm run db:pg:generate` to create migration SQL

## 2. Course Entity & Repositories

- [ ] 2.1 Create `Course`, `Module`, `Lesson` entity interfaces in `src/entities/`
- [ ] 2.2 Create `ICourseRepository` interface
- [ ] 2.3 Create `IModuleRepository` interface
- [ ] 2.4 Create `ILessonRepository` interface
- [ ] 2.5 Implement `PgCourseRepository`
- [ ] 2.6 Implement `InMemoryCourseRepository`
- [ ] 2.7 Implement `PgModuleRepository`
- [ ] 2.8 Implement `InMemoryModuleRepository`
- [ ] 2.9 Implement `PgLessonRepository`
- [ ] 2.10 Implement `InMemoryLessonRepository`
- [ ] 2.11 Register all 3 in `repositoryFactory.ts`

## 3. Enrollment Entity & Repositories

- [ ] 3.1 Create `Enrollment`, `LessonProgress` entity interfaces
- [ ] 3.2 Create `IEnrollmentRepository` interface
- [ ] 3.3 Create `ILessonProgressRepository` interface
- [ ] 3.4 Implement `PgEnrollmentRepository`
- [ ] 3.5 Implement `InMemoryEnrollmentRepository`
- [ ] 3.6 Implement `PgLessonProgressRepository`
- [ ] 3.7 Implement `InMemoryLessonProgressRepository`
- [ ] 3.8 Register both in `repositoryFactory.ts`

## 4. Course Service & Controllers

- [ ] 4.1 Create `courseService.ts` with CRUD logic for courses, modules, lessons
- [ ] 4.2 Create `enrollmentService.ts` with enroll, complete lesson, progress calculation, points integration
- [ ] 4.3 Create `courseController.ts` (CRUD + catalog + detail)
- [ ] 4.4 Create `courseModuleController.ts` (add/reorder modules)
- [ ] 4.5 Create `courseLessonController.ts` (add lesson to module)
- [ ] 4.6 Create `enrollmentController.ts` (enroll, complete lesson, my enrollments)
- [ ] 4.7 Create `courseCertificateController.ts` (generate certificate PDF)
- [ ] 4.8 Create `courseRoutes.ts` and register in routes/index.ts
- [ ] 4.9 Wire course completion to gamification points (+100, source "course_completion")

## 5. Frontend — Admin Course Builder

- [ ] 5.1 Create admin courses list page at `/admin/cursos`
- [ ] 5.2 Create admin course create/edit form (title, description, level, category, image)
- [ ] 5.3 Create module manager (add/reorder modules within a course)
- [ ] 5.4 Create lesson editor with content type selector (text/video/quiz)
- [ ] 5.5 Create quiz question editor (question, options, correct answer)
- [ ] 5.6 Add "Cursos" link to admin sidebar navigation

## 6. Frontend — Portal Course Catalog

- [ ] 6.1 Create course catalog page at `/portal/cursos` with grid of published courses
- [ ] 6.2 Create course detail page at `/portal/cursos/[id]` with curriculum and enroll button
- [ ] 6.3 Create lesson reader page at `/portal/cursos/[id]/lecciones/[lessonId]`
- [ ] 6.4 Implement lesson content rendering: HTML for text, iframe for video, interactive quiz
- [ ] 6.5 Add progress bar on course detail page
- [ ] 6.6 Add "Cursos" tab to portal layout navbar
- [ ] 6.7 Create "Mis cursos" section on portal home showing enrolled courses with progress
- [ ] 6.8 Add certificate download button on completed courses

## 7. Testing

- [ ] 7.1 Write unit tests for Course repository (in-memory)
- [ ] 7.2 Write unit tests for Enrollment repository (in-memory)
- [ ] 7.3 Write unit tests for courseService (CRUD operations)
- [ ] 7.4 Write unit tests for enrollmentService (enroll, complete, progress, points)
- [ ] 7.5 Write controller tests for course endpoints
- [ ] 7.6 Write controller tests for enrollment endpoints
- [ ] 7.7 Run typecheck: `pnpm run typecheck`
- [ ] 7.8 Run lint: `pnpm run lint`
- [ ] 7.9 Run full test suite: `pnpm test`
