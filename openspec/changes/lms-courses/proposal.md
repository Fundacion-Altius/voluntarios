## Why

Volunteers currently have no structured learning path — no courses, no modules, no progress tracking, no way to certify skills gained through the foundation. The LMS fills this gap by providing a lightweight course platform where staff can create courses (without video) and volunteers can enroll, complete lessons, track progress, and earn course certificates. This increases volunteer engagement, provides measurable skill development, and gives the foundation a tool for mandatory training (e.g., child protection, onboarding).

## What Changes

- **Course management**: admin/staff can create courses with modules and lessons (text, embedded video URL, or quiz). Each course has a title, description, image, level, and category.
- **Enrollment & progress**: volunteers can browse a course catalog, enroll, complete lessons one by one, and track their percentage progress.
- **Course certificates**: upon completing all lessons, volunteers can download a course-specific certificate (reuses the existing PDF generator pattern).
- **Gamification integration**: completing a course awards bonus points.
- **No video hosting**: lessons can embed YouTube/Vimeo URLs but there's no native video player or upload.

## Capabilities

### New Capabilities
- `courses`: Course, module, and lesson CRUD for staff; catalog browsing for volunteers
- `enrollments`: Self-enrollment, lesson-by-lesson progress tracking
- `course-certificates`: Per-course certificate generation (reuses PDFGenerator)

### Modified Capabilities
- `gamification`: Course completion awards points (new point source `"course_completion"`)

## Impact

- **Backend**: 5 new PG tables (`courses`, `modules`, `lessons`, `enrollments`, `lesson_progress`); 5 repository pairs (PG + in-memory); 2 services (course, enrollment); new route group under `/api/courses`
- **Frontend admin**: course builder with module/lesson wizard
- **Frontend portal**: course catalog, course detail with curriculum, lesson reader, progress bar
- **No new npm dependencies** (embedded videos via iframe, quizzes via simple multiple-choice stored as JSON)
