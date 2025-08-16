# Frontend Documentation

## Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your values (API base URL, Socket.IO URL).
3. Run in development:
   ```bash
   npm run dev
   ```

## Main Features
- Register/login, JWT auth
- Upload, solve, and share Sudoku puzzles
- Social feed, follow, like, comment
- Live solving, spectator chat, challenge mode
- Mobile-optimized, accessible, dark mode

## Deployment
- Build for production:
  ```bash
  npm run build
  ```
- Use Docker Compose or the frontend Dockerfile for production static serving (Nginx or via backend).
