# Backend Documentation

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your values.
3. Start MongoDB locally or use Docker Compose.
4. Run in development:
   ```bash
   npm run dev
   ```

## Environment Variables
- See `.env.example` for all required variables (MongoDB, JWT, CORS, email, etc).

## API Route Overview

| Method | Route                        | Description                       |
|--------|------------------------------|-----------------------------------|
| POST   | /api/auth/register           | Register a new user               |
| POST   | /api/auth/login              | Login                             |
| GET    | /api/sudoku                  | Get user's puzzles                |
| POST   | /api/sudoku                  | Upload new puzzle                 |
| POST   | /api/sudoku/:id/like         | Like a puzzle                     |
| POST   | /api/sudoku/:id/comment      | Comment on a puzzle               |
| DELETE | /api/sudoku/:id              | Delete a puzzle                   |
| GET    | /api/sudoku/feed             | Feed of followed users            |
| POST   | /api/challenge/:id/start     | Start a challenge                 |
| POST   | /api/challenge/:id/solve     | Submit solve time                 |
| GET    | /api/challenge/:id/leaderboard | Get challenge leaderboard      |
| GET    | /api/users/:id/profile       | Get user profile                  |
| POST   | /users/:id/follow            | Follow a user                     |
| POST   | /users/:id/unfollow          | Unfollow a user                   |
| GET    | /r/:username                 | Referral redirect                 |
| GET    | /health                      | Health check                      |

## Deployment

- Use Docker Compose: `docker-compose up --build`
- Or build and run backend Dockerfile directly.
- The backend serves both API and frontend static files in production.
- Use PM2 for process management in production.
