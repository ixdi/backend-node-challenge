# Backend Challenger

> :warning: !! NOT READY YET, DEPLOY IS NOT DONE !!

## Description

Given the instructions in the [challenge](./challenge.md)

The code is based on the template from CodelyTv for the DDD.

## Setup

Install dependencies using pnpm (you can use npm or yarn):

```bash
pnpm install
```

Start localy the backend server:

```bash
pnpm dev
```

Test the backend server:

```bash
pnpm test
pnpm test:e2e
```

Deploy the backend server using serverless framework:

```bash
pnpm deploy
```

## Tech Stack

The solution is writen in Typescript using

- Node.js
- Database: MongoDB in Atlas
- Testing: Vitest
- E2E Testing: Playwright

## Code Architecture

The architecture has the following structure:

- src/ - Contains the backend application
- tests/ - Contains the unit tests and integration tests
- tests-e2e/ - Contains the end-to-end tests
- design/ - Contains the system requirements and design
- .husky/ - Contains the restrictions for the git
- .github: Contains the Github workflows

### Design

- [User Stories](./design/UserStories.md)
- [Use Cases](./design/UseCases.md)
- [Database](./design/Database.md)

### Backend

Using the DDD pattern with the following folder structure:

- Server: Contains the server configuration
- Controllers: Contains the API routes
- Contexts:
  - Bounding Contexts
    - Modules
      - Application: Contains the use cases
      - Domain: Contains the entities and value objects
      - Infrastructure: Contains the database and other external services
    - Shared: Contains the shared code between the modules
  - Shared: Contains the shared code between the BC

### Improvements

- Add more fields to the Customer collection like address, phone, dni, etc.
- Add a User collection with authentication and authorization attached to the customer
- Use Database transactions (code is ready) for the repositories operations when necessary
- Add event buses and domain events
- Probably for high traffic, use a command and query bus
