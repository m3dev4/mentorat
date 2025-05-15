import express from 'express';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';
import {
  addTrainerBadge,
  becomeTrainer,
  getTrainerAvailability,
  getTrainerById,
  getTrainerProfile,
  listTrainer,
  updateTrainerAvailability,
  updateTrainerProfile,
  verifyTrainer,
} from '../../controllers/trainer/trainer.controller.js';

const router = express.Router();

//Public route
router.get('/', listTrainer);
// router.get('/:id', getTrainerById);
// router.get('/:trainerId/availability', getTrainerAvailability);

router.use(protect);

//Devenir formateur
router.post('/become-trainer', becomeTrainer);
router.get('/me', getTrainerProfile);
router.put('/profile', updateTrainerProfile);
router.put('/availability', updateTrainerAvailability);

//Route pour les admins
router.use(restrictTo('administrateur'));
router.put('/:id/verify', verifyTrainer);
router.put('/:id/badge', addTrainerBadge);

export default router;
