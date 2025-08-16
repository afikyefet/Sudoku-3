import { Router } from 'express';
import { getLeaderboard, startChallenge, submitSolve } from '../controllers/challengeController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// @route   POST /challenge/:id/start
// @desc    Make puzzle a public challenge
router.post('/:id/start', protect, startChallenge);

// @route   POST /challenge/:id/solve
// @desc    Submit solve time for challenge
router.post('/:id/solve', protect, submitSolve);

// @route   GET /challenge/:id/leaderboard
// @desc    Get challenge leaderboard
router.get('/:id/leaderboard', getLeaderboard);

export default router;
