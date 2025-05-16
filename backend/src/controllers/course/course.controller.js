import asyncHandler from '../../middlewares/asyncHandler.middleware.js';
import Course from '../../models/course.model.js';
import Category from '../../models/category.model.js';
import AppError from '../../middlewares/appError.middleware.js';
import { syncTrainerCourse } from '../../services/sync/sync.Service.js';
import { PrismaClient } from '@prisma/client';

const primsa = new PrismaClient();

// src/controllers/course/course.controller.js (corrections)
export const createCourse = asyncHandler(async (req, res, next) => {
  try {
    // Vérifier que l'utilisateur est connecté et a un ID
    const user = req.user;
    if (!user) {
      return next(new AppError('Vous devez être connecté pour créer un cours', 401));
    }

    // Récupérer l'ID correctement (peut être dans différentes propriétés selon votre auth)
    const trainerId = user._id || user.id || user.userId;

    if (!trainerId) {
      return next(new AppError('ID de formateur non trouvé', 400));
    }

    console.log('Creating course with instructor ID:', trainerId);

    // Créer le cours avec l'instructeur clairement défini
    const newCourse = await Course.create({
      ...req.body,
      instructor: trainerId,
    });

    // Suite du code...
    try {
      await syncTrainerCourse(trainerId);
      console.log('Synchronisation PostgreSQL réussie');
    } catch (syncError) {
      console.error('Erreur lors de la synchronisation PostgreSQL:', syncError);
    }

    res.status(201).json({
      status: 'success',
      data: {
        course: newCourse,
      },
    });
  } catch (error) {
    console.error('Une erreur est survenue lors de la création du cours:', error);
    return next(new AppError(error.message, 500));
  }
});

export const getAllCourses = asyncHandler(async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.level) {
      filter.level = req.query.level;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'firstName lastName profilePicture')
      .populate('category', 'name slug');

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});
