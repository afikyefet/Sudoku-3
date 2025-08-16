import { Request, Response } from 'express';

// @desc    Redirect to register with referral
export const handleReferralRedirect = async (req: Request, res: Response) => {
    const { username } = req.params;
    // Redirect to frontend register page with ref param
    res.redirect(`/register?ref=${encodeURIComponent(username)}`);
};
