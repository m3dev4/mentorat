// src/controllers/lesson/lesson.controller.js
import { PrismaClient } from '@prisma/client';
import asyncHandler from '../../middlewares/asyncHandler.middleware.js';
import AppError from '../../middlewares/appError.middleware.js';
import Course from '../../models/course.model.js';

const prisma = new PrismaClient();

// Créer une nouvelle leçon pour un module
export const createLesson = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;
  const { title, description, type, videoUrl, htmlContent, order } = req.body;
  
  try {
    // Récupérer l'ID utilisateur correctement
    const userId = req.user._id || req.user.id || req.user.userId;
    
    if (!userId) {
      return next(new AppError('Utilisateur non authentifié', 401));
    }
    
    // Récupérer le module
    const module = await prisma.module.findUnique({
      where: { id: moduleId }
    });
    
    if (!module) {
      return next(new AppError('Module non trouvé', 404));
    }
    
    console.log('Module ID:', moduleId);
    console.log('Course ID from module:', module.courseId);
    
    // Récupérer le cours depuis MongoDB pour vérifier les permissions
    const course = await Course.findById(module.courseId);
    
    if (!course) {
      return next(new AppError('Cours associé non trouvé', 404));
    }
    
    console.log('Course instructor:', course.instructor);
    console.log('Current user ID:', userId);
    
    // Comparer les ID en tant que chaînes
    const instructorId = course.instructor.toString();
    const currentUserId = userId.toString();
    
    if (instructorId !== currentUserId) {
      console.log('Authorization failed:');
      console.log('Instructor ID:', instructorId);
      console.log('User ID:', currentUserId);
      return next(new AppError('Vous n\'êtes pas autorisé à créer une leçon pour ce module', 403));
    }
    
    // Créer la leçon
    const newLesson = await prisma.lesson.create({
      data: {
        title,
        description,
        type,
        videoUrl,
        htmlContent,
        order: order || 0,
        moduleId
      }
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        lesson: newLesson
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de la leçon:', error);
    return next(new AppError(error.message, 500));
  }
});

// Récupérer toutes les leçons d'un module
export const getLessons = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;
  
  try {
    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        lessons
      }
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Mettre à jour une leçon
export const updateLesson = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;
  const updateData = req.body;
  
  try {
    // Récupérer la leçon
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true }
    });
    
    if (!lesson) {
      return next(new AppError('Leçon non trouvée', 404));
    }
    
    // Récupérer le cours depuis MongoDB pour vérifier les permissions
    const course = await Course.findById(lesson.module.courseId);
    
    if (!course) {
      return next(new AppError('Cours associé non trouvé', 404));
    }
    
    const userId = req.user._id || req.user.id || req.user.userId;
    
    // Vérifier l'autorisation
    if (course.instructor.toString() !== userId.toString()) {
      return next(new AppError('Vous n\'êtes pas autorisé à modifier cette leçon', 403));
    }
    
    // Mettre à jour la leçon
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: updateData
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        lesson: updatedLesson
      }
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

export default {
  createLesson,
  getLessons,
  updateLesson
};