// src/controllers/module/module.controller.js
import { PrismaClient } from '@prisma/client';
import asyncHandler from '../../middlewares/asyncHandler.middleware.js';
import AppError from '../../middlewares/appError.middleware.js';
import mongoose from 'mongoose';
import Course from '../../models/course.model.js';

const prisma = new PrismaClient();

// Créer un nouveau module pour un cours
export const createModule = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { title, description, order } = req.body;
  
  try {
    // Récupérer l'identifiant de l'utilisateur
    const userId = req.user._id || req.user.id || req.user.userId;
    
    if (!userId) {
      return next(new AppError('Utilisateur non authentifié', 401));
    }
    
    console.log('User ID:', userId);
    console.log('Course ID:', courseId);
    
    // Vérifier si le cours existe et appartient à ce formateur dans MongoDB
    const course = await Course.findById(courseId);
    
    if (!course) {
      return next(new AppError('Cours non trouvé', 404));
    }
    
    console.log('Course Instructor:', course.instructor);
    
    // Vérifier que le formateur est propriétaire du cours
    // Compare les ID en tant que chaînes pour éviter les problèmes de type
    const instructorId = course.instructor.toString();
    const currentUserId = userId.toString();
    
    if (instructorId !== currentUserId) {
      console.log('Authorization failed: instructorId ≠ currentUserId');
      console.log('Instructor ID (string):', instructorId);
      console.log('Current User ID (string):', currentUserId);
      return next(new AppError('Vous n\'êtes pas autorisé à modifier ce cours', 403));
    }
    
    // Créer le nouveau module dans PostgreSQL
    const newModule = await prisma.module.create({
      data: {
        title,
        description,
        order: order || 0,
        courseId
      }
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        module: newModule
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du module:', error);
    return next(new AppError(error.message, 500));
  }
});

// Récupérer tous les modules d'un cours
export const getModules = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  
  try {
    const modules = await prisma.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        modules
      }
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Mettre à jour un module
export const updateModule = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;
  const updateData = req.body;
  
  try {
    // Récupération du module et du cours associé
    const module = await prisma.module.findUnique({
      where: { id: moduleId }
    });
    
    if (!module) {
      return next(new AppError('Module non trouvé', 404));
    }
    
    // Vérifier l'autorisation via MongoDB
    const course = await Course.findById(module.courseId);
    
    if (!course) {
      return next(new AppError('Cours associé non trouvé', 404));
    }
    
    const userId = req.user._id || req.user.id || req.user.userId;
    
    if (course.instructor.toString() !== userId.toString()) {
      return next(new AppError('Vous n\'êtes pas autorisé à modifier ce module', 403));
    }
    
    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: updateData
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        module: updatedModule
      }
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

export default {
  createModule,
  getModules,
  updateModule
};