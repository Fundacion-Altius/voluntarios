## Purpose

Unit tests for survey-related controllers (Question, Survey, SurveyAnswer, SurveySubmission). TBD.

## Requirements

### Requirement: Question controller CRUD delegates to repository
Each question controller handler SHALL delegate to `supabaseQuestionRepository` and return appropriate HTTP responses.

#### Scenario: getAllQuestions returns 200 with questions list
- **WHEN** `getAllQuestions` is called and the repository returns questions
- **THEN** it SHALL return a 200 response with the questions array

#### Scenario: getQuestionById returns 200 for existing question
- **WHEN** `getQuestionById` is called with an existing question ID
- **THEN** it SHALL return a 200 response with the question data

#### Scenario: getQuestionById returns 404 for non-existent question
- **WHEN** `getQuestionById` is called with a non-existent ID
- **THEN** it SHALL return a 404 response

#### Scenario: createQuestion returns 201
- **WHEN** `createQuestion` is called with valid question data
- **THEN** it SHALL return a 201 response with the created question

#### Scenario: Returns 500 on repository error
- **WHEN** any question controller handler is called and the repository throws
- **THEN** it SHALL return a 500 response

### Requirement: Survey controller CRUD and submit delegates to repository
Each survey controller handler SHALL delegate to the appropriate supabase repositories.

#### Scenario: getAllSurveys returns 200 with surveys list
- **WHEN** `getAllSurveys` is called
- **THEN** it SHALL return a 200 response with surveys data

#### Scenario: submitSurvey creates submission and answers
- **WHEN** `submitSurvey` is called with valid survey ID, ratings, and additional answer
- **THEN** it SHALL create a SurveySubmission and corresponding SurveyAnswers, returning 201

#### Scenario: submitSurvey returns 500 on error
- **WHEN** `submitSurvey` is called and any repository operation fails
- **THEN** it SHALL return a 500 response

### Requirement: SurveyAnswer controller CRUD delegates to repository
Each surveyAnswer handler SHALL delegate to `supabaseSurveyAnswerRepository`.

#### Scenario: Standard CRUD returns expected status codes
- **WHEN** each CRUD handler is called with appropriate parameters
- **THEN** it SHALL return 200 (getAll/getById/update), 201 (create), or 204 (delete)

### Requirement: SurveySubmission controller CRUD delegates to repository
Each surveySubmission handler SHALL delegate to `supabaseSurveySubmissionRepository`.

#### Scenario: Standard CRUD returns expected status codes
- **WHEN** each CRUD handler is called with appropriate parameters
- **THEN** it SHALL return 200 (getAll/getById/update), 201 (create), or 204 (delete)
