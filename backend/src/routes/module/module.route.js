// src/routes/module/module.route.js
import express from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import {
  createModule,
  getModules,
  updateModule,
} from '../../controllers/module/module.controller.js';

const router = express.Router({ mergeParams: true });

// Routes protégées
router.use(protect);

// Routes pour les modules
router.route('/').get(getModules).post(createModule);

router.route('/:moduleId').put(updateModule);

export default router;
