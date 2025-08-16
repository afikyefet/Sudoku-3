import { Request, Response } from 'express';
import { sendNewFollowerEmail } from '../services/notificationService';

// @desc    Follow a user
export const followUser = async (req: Request, res: Response) => {
    // TODO: Implement follow user logic
    // After follow:
    await sendNewFollowerEmail(followedUser.email, req.user.username);
};

// @desc    Unfollow a user
export const unfollowUser = async (req: Request, res: Response) => {
    // TODO: Implement unfollow user logic
};

// @desc    Get user profile, puzzles, follower count
export const getUserProfile = async (req: Request, res: Response) => {
    // TODO: Implement get user profile logic
};
