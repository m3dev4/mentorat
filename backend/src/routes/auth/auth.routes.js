import express from 'express';
import {
  getMe,
  register,
  login,
  logout,
  verifyEmail,
  updateProfile,
  updatePassword,
} from '../../controllers/auth/auth.controller.js';
import { authRateLimit } from '../../middlewares/rateLimit.middleware.js';
import { protect } from '../../middlewares/auth.middleware.js';


const router = express.Router();


// Appliquer la limite de taux aux routes d'authentification
router.post('/register', authRateLimit, register);
router.post('/login', authRateLimit, login);
router.get('/logout', logout);
router.get('/verify-email/:token', verifyEmail);

//Route proteger
router.use(protect);
router.get('/me', getMe);
router.put('/update-profile', updateProfile);
router.patch('/update-password', updatePassword);

export default router;
