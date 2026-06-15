# CBT Platform

Simple CBT Platform for School Students.

Built With:

- Next.js
- MongoDB
- Docker
- Tailwind CSS

Supports:

- Tamil Questions
- English Questions
- Word File Upload
- Roll Number Based Exam System

---

# Project Structure

```text
cbt-platform/
│
├── app/
├── components/
├── lib/
├── models/
├── uploads/
│
├── docker/
│   ├── dev/
│   └── prod/
│
├── docker-compose.dev.yml
├── docker-compose.prod.yml
│
└── README.md
```

---

# Requirements

Install:

- Node.js
- Docker Desktop

---

# Development Setup

# Start Development Server

```bash

```

Open:

```text
http://localhost:3000
```

---

```bash
docker compose -f docker-compose.dev.yml up --build
```

# Stop Development Server

```bash
CTRL + C
```

OR

```bash
docker compose -f docker-compose.dev.yml down
```

---

# Production Setup

# Start Production Server

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

---

# Stop Production Server

```bash
docker compose -f docker-compose.prod.yml down
```

---

# MongoDB Commands

# Open Mongo Shell

```bash
docker exec -it cbt-platform-mongo-1 mongosh
```

# Select Database

```js
use cbt
```

# View Tests

```js
db.tests.find();
```

---

# API Test

# Create Test API

POST:

```text
http://localhost:3000/api/tests/create
```

Example JSON:

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

---

# Features

- Create Tests
- MCQ Questions
- Tamil Support
- English Support
- Student Roll Number Entry
- Result Storage
- Docker Support
- MongoDB Storage

---

# Future Features

- Word Upload
- AI Question Generator
- Student Analytics
- Exam Timer
- Fullscreen Exam Mode
- Auto Submit
- Random Questions

---

# Notes

Development mode supports:

- Hot Reload
- Live Changes
- Auto Refresh

Production mode uses:

- Optimized Build
- Stable Runtime
- Restart Policies
