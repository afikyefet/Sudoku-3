import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Register a new user
export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, referrer } = req.body;
        let newUser = new User({ username, email, password });
        if (referrer) {
            const refUser = await User.findOne({ username: referrer });
            if (refUser) {
                newUser.referrer = refUser._id;
                refUser.referrals.push(newUser._id);
                refUser.referralCount = (refUser.referralCount || 0) + 1;
                refUser.referralPoints = (refUser.referralPoints || 0) + 10; // Example: 10 points per referral
                if (refUser.referralCount >= 5) refUser.referralFlair = 'Super Referrer';
                await refUser.save();
            }
        }
        await newUser.save();
        // ... return JWT and user ...
    } catch (err) {
        // ... error handling ...
    }
};

// @desc    Login user
export const login = async (req: Request, res: Response) => {
    // TODO: Implement user login
};
