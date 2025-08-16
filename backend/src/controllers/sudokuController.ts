import { Request, Response } from 'express';
import { sendCommentEmail } from '../services/notificationService';

// @desc    Return current user's puzzles
export const getUserPuzzles = async (req: Request, res: Response) => {
    // TODO: Implement fetching user's puzzles
};

// @desc    Return public puzzles from followed users
export const getFeed = async (req: Request, res: Response) => {
    // TODO: Implement fetching feed puzzles
};

// @desc    Create new puzzle (max 20 per user)
export const createSudoku = async (req: Request, res: Response) => {
    // TODO: Implement puzzle creation with limit
};

// @desc    Like a puzzle
export const likeSudoku = async (req: Request, res: Response) => {
    // TODO: Implement liking a puzzle
    // After saving like:
    // emitLike(puzzleId, userId);
};

// @desc    Comment on a puzzle
export const commentSudoku = async (req: Request, res: Response) => {
    // TODO: Implement commenting on a puzzle
    // After saving comment:
    // emitComment(puzzleId, commentObj);
    // After comment:
    await sendCommentEmail(puzzleOwner.email, puzzle.title, req.user.username, req.body.content);
};

// @desc    Delete a puzzle
export const deleteSudoku = async (req: Request, res: Response) => {
    // TODO: Implement puzzle deletion
};
