import { Router } from 'express';
// import { followUser, unfollowUser, getUserProfile } from '../controllers/userController';
// import { protect } from '../middleware/authMiddleware';

const router = Router();

// @route   POST /users/:id/follow
// @desc    Follow a user
// router.post('/:id/follow', protect, followUser);

// @route   POST /users/:id/unfollow
// @desc    Unfollow a user
// router.post('/:id/unfollow', protect, unfollowUser);

// @route   GET /users/:id/profile
// @desc    Get user profile, puzzles, follower count
// router.get('/:id/profile', protect, getUserProfile);

export default router;
