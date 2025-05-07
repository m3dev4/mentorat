import express from 'express';
import {
    getMe,
  login,
  logout,
  refreshToken,
  register,
  resendVerificationEmail,
  updatePassword,
  updateProfile,
  verifyEmail,
} from '../../controllers/auth/auth.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/refresh-token', refreshToken);

//Route proteger
router.use(protect);
router.get('/me', getMe);
router.put('/update-profile', updateProfile);
router.patch('/update-password', updatePassword);

export default router;
