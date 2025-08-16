# Sudoku Social App Backend

## Setup

1. **Clone the repo**
2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```
3. **Create a `.env` file** in `backend/`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/sudoku
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```
4. **Run in development mode**
   ```bash
   npm run dev
   ```

## CORS
- The backend allows requests from `CLIENT_URL` (default: `http://localhost:5173`).
- Adjust `CLIENT_URL` in `.env` if your frontend runs elsewhere.

## Error Handling
- All errors are returned as JSON with a `message` field.
- Centralized error handler logs errors to the console.

## Route Security
- All sensitive routes are protected with JWT authentication middleware.
- Pass the JWT as a Bearer token in the `Authorization` header.

## Comments
- All code is commented for clarity and maintainability.

---

For frontend setup, see the `frontend/` directory.
