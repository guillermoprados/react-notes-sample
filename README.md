# Simple Notes Web App

This is a simple sample project that uses React for the frontend and NestJS for the backend in a mono-repo approach.

The app lets users create, categorize, delete, and archive notes.

It also supports user authentication and roles—admins can manage categories. (wip)

## Main Technologies & Versions

- React (18+)
- Vite
- Zustand (5+)
- Tailwind CSS
- NestJS (10+)
- PostgreSQL (14+)
- Docker & Docker Compose

## How to Run

1. Make sure Docker and Docker Compose are installed.
2. Run the project with:
   ```sh
   ./start.sh
   ```
3. The app will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api

## Test User

- **Email:** user@test.com
- **Password:** 123123

## Notes

- The database is seeded automatically with a test user and categories on first run.
- Environment files are auto-generated from templates if missing.
