import { Request, Response } from 'express';

// @desc    Make puzzle a public challenge
export const startChallenge = async (req: Request, res: Response) => {
    // TODO: Set isChallenge to true for puzzle, make public
};

// @desc    Submit solve time for challenge
export const submitSolve = async (req: Request, res: Response) => {
    // TODO: Add user/time to challengeLeaderboard if not already present
};

// @desc    Get challenge leaderboard
export const getLeaderboard = async (req: Request, res: Response) => {
    // TODO: Return sorted leaderboard for puzzle
};
