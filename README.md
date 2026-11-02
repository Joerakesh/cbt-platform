# CBT Platform

A web-based **Computer-Based Testing platform** for creating and conducting school assessments. The project is built with **Next.js, React, TypeScript, MongoDB and Tailwind CSS**, with support for Tamil and English question content.

## Project capabilities

The current project is designed around these workflows:

- Create and manage tests.
- Prepare multiple-choice questions.
- Support Tamil and English question content.
- Enter examinations using a student roll number.
- Store test and result data in MongoDB.
- Import question content from Word documents using document-processing dependencies.
- Run the application locally or through the supplied Docker Compose configurations.

> Feature availability can depend on the current application configuration and implementation. Check the UI and API before treating roadmap items as released functionality.

## Technology stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 |
| UI | React 19 |
| Language | TypeScript |
| Database | MongoDB with Mongoose |
| State management | Redux Toolkit |
| Forms and validation | React Hook Form, Zod |
| Styling | Tailwind CSS |
| Document handling | Mammoth |
| Spreadsheet support | XLSX |
| Containerization | Docker Compose |

## Repository layout

```text
cbt-platform/
├── app/                 # Next.js routes and application pages
├── components/          # Reusable UI components
├── lib/                 # Shared utilities and application logic
├── models/              # MongoDB/Mongoose models
├── docker/              # Docker-related configuration
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── README.md
```

## Requirements

- Node.js compatible with the installed Next.js version
- npm
- MongoDB (local or hosted), or Docker Desktop with Docker Compose

## Run locally

```bash
git clone https://github.com/Joerakesh/cbt-platform.git
cd cbt-platform
npm install
```

Create a local environment file using the variables required by the application. Do not commit secrets:

```bash
# Windows PowerShell
Copy-Item .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

Configure the MongoDB connection and any authentication secrets in the local environment file, then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker

Development:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Production-style local container run:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Stop the corresponding stack:

```bash
docker compose -f docker-compose.dev.yml down
# or
docker compose -f docker-compose.prod.yml down
```

## Useful scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## API example

The repository includes a test-creation endpoint at `POST /api/tests/create`. An example request shape:

```json
{
  "title": "Unit Test",
  "subject": "Computer Science",
  "duration": 30,
  "language": "tamil",
  "questions": [
    {
      "question": "கணினியின் மூளை எது?",
      "options": ["CPU", "RAM", "ROM", "SSD"],
      "correctAnswer": "CPU"
    }
  ]
}
```

Use the application's actual validation rules and authentication requirements when calling the endpoint.

## Security checklist

Before using this system with real student data, verify server-side authorization for every exam and result endpoint, protect answer keys from student responses, validate uploaded files and file sizes, hash passwords, secure session handling, and test exam submission and timing behavior. Use synthetic student data during development.

## Roadmap

- Strong role-based access for administrators, staff and students.
- Question bank and reusable question sets.
- Reliable exam scheduling and timed submissions.
- Audit logs and result exports.
- Automated tests for authentication, authorization and exam integrity.

## License

No license is specified here. Contact the repository owner before reusing or redistributing the code.
