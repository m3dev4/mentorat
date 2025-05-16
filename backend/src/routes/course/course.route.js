import express from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import { createCourse, getAllCourses } from '../../controllers/course/course.controller.js';

const router = express.Router();

router.get('/', getAllCourses);

router.use(protect);

router.post('/', createCourse);

export default router;
