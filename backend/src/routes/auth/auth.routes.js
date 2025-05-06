import express from 'express';
import { register } from '../../controllers/auth/auth.controller.js';

const router = express.Router();

router.post('/register', register);

export default router;
