import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { CORS_ORIGINS, MONGODB_URI, PORT } from './config/env';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import { initSocket } from './realtime/socket';
import challengeRoutes from './routes/challengeRoutes';
import referralRoutes from './routes/referralRoutes';

// Load environment variables from .env file
dotenv.config();

const app = express();

// CORS options for security
const corsOptions = {
    origin: CORS_ORIGINS,
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Import routes
import authRoutes from './routes/authRoutes';
import puzzleRoutes from './routes/puzzleRoutes';
import sudokuRoutes from './routes/sudokuRoutes';
import userRoutes from './routes/userRoutes';

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/puzzles', puzzleRoutes);
app.use('/api/sudoku', sudokuRoutes);
app.use('/api/users', userRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/r', referralRoutes);

// Centralized error handler
app.use(notFound);
app.use(errorHandler);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Sudoku API is running!');
});

// Create HTTP server and attach Socket.IO
const httpServer = createServer(app);
initSocket(httpServer);
// Start the server
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
