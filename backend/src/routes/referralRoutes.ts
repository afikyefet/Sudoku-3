import { Router } from 'express';
import { handleReferralRedirect } from '../controllers/referralController';

const router = Router();

// @route   GET /r/:username
// @desc    Redirect to register with referral
router.get('/:username', handleReferralRedirect);

export default router;
