import express from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import { createCourse, getAllCourses, getCourse } from '../../controllers/course/course.controller.js';
import moduleRoutes from '../module/module.route.js';
import lessonRoutes from '../lesson/lesson.route.js';
import { validateMongoId } from '../../middlewares/validation.middleware.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/:idOrSlug', getCourse);

router.use(protect);    

router.post('/', createCourse);
router.use('/:courseId/modules', validateMongoId('courseId'), moduleRoutes);
router.use('/:courseId/modules/:moduleId/lessons', validateMongoId('courseId'), lessonRoutes);

export default router;
