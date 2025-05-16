import express from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import { createLesson, getLessons } from '../../controllers/lesson/lesson.controller.js';



const router = express.Router({ mergeParams: true })

router.use(protect)

router.route('/')
    .post(createLesson)
    .get(getLessons)


export default router