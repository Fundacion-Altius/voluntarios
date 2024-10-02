# Contracts POC

This is a Proof of Concept (POC) application for managing contracts. It consists of a frontend built with Next.js and a backend built with Express.js.

## Prerequisites

- Docker and Docker Compose
- Node.js (version specified in package.json files)
- npm or yarn

## Getting Started

### Using Docker (Recommended)

1. Clone the repository
2. Navigate to the project root directory
3. Run the following command to start the application:

```bash
docker compose up --build
```

This will build and start the frontend, backend, and MariaDB database containers.

- Frontend will be available at: http://localhost:3000
- Backend will be available at: http://localhost:3001
If you prefer to develop instead, then use:
```bash
docker compose -f docker-dev.yaml up --build
```
### Manual Setup

If you prefer to run the application without Docker:

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd back
npm install

# Install frontend dependencies
cd ../front
npm install
```

3. Start the backend server:

```bash
cd back
npm run dev
```

4. In a new terminal, start the frontend development server:

```bash
cd front
npm run dev
```

## Running Tests

### Backend

```bash
cd back
npm test          # Run tests
npm run test:w    # Run tests in watch mode
npm run test:c    # Run tests with coverage
```

### Frontend

```bash
cd front
npm test          # Run tests
npm run test:watch # Run tests in watch mode
npm run test:cov   # Run tests with coverage
npm run cypress:open # Open Cypress for E2E testing
npm run cypress:run  # Run Cypress tests headlessly
```

## Features

- Contract management
- PDF generation
- Digital signatures

## Tech Stack

- Frontend: Next.js, React, TypeScript
- Backend: Express.js, TypeScript
- Database: MariaDB
- Testing: Jest, Cypress
- Other tools: ESLint, Prettier, Husky
- Containerization: Docker

## Project Structure

- `/front`: Frontend application (Next.js)
- `/back`: Backend application (Express.js)
- `compose-dev.yaml`: Docker Compose configuration for development

For more detailed information about dependencies and scripts, please refer to the `package.json` files in the `front` and `back` directories.