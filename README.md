# Hirelens Notes App

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

## Main Technologies & Versions

- React (18+)
- Vite (frontend build)
- Tailwind CSS (latest)
- NestJS (10+)
- PostgreSQL (14+)
- Docker & Docker Compose

## Notes

- The database is seeded automatically with a test user and categories on first run.
- Environment files are auto-generated from templates if missing.
