import { Router } from 'express';
// import { getUserPuzzles, getFeed, createSudoku, likeSudoku, commentSudoku, deleteSudoku } from '../controllers/sudokuController';
// import { protect } from '../middleware/authMiddleware';

const router = Router();

// @route   GET /sudoku
// @desc    Return current user's puzzles
// router.get('/', protect, getUserPuzzles);

// @route   GET /sudoku/feed
// @desc    Return public puzzles from followed users
// router.get('/feed', protect, getFeed);

// @route   POST /sudoku
// @desc    Create new puzzle (max 20 per user)
// router.post('/', protect, createSudoku);

// @route   POST /sudoku/:id/like
// @desc    Like a puzzle
// router.post('/:id/like', protect, likeSudoku);

// @route   POST /sudoku/:id/comment
// @desc    Comment on a puzzle
// router.post('/:id/comment', protect, commentSudoku);

// @route   DELETE /sudoku/:id
// @desc    Delete a puzzle
// router.delete('/:id', protect, deleteSudoku);

export default router;
