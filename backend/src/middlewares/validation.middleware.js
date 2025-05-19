import mongoose from "mongoose";
import Course from "../models/course.model.js";
import AppError from "./appError.middleware.js";

// Middleware pour valider un ID MongoDB
export const validateMongoId = (paramName) => (req, res, next) => {
  const id = req.params[paramName];
  
  if (!id) {
    return next();
  }
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError(`${paramName} invalide`, 400));
  }
  
  next();
};

// Middleware pour vérifier la propriété d'un cours
export const checkCourseOwnership = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user._id || req.user.id || req.user.userId;
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(new AppError('ID de cours invalide', 400));
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError('Cours non trouvé', 404));
    }
    
    if (course.instructor.toString() !== userId.toString()) {
      return next(new AppError("Vous n'êtes pas autorisé à modifier ce cours", 403));
    }
    
    // Ajouter le cours à la requête pour éviter de le rechercher à nouveau
    req.course = course;
    next();
  } catch (error) {
    next(new AppError('Erreur lors de la vérification des permissions', 500));
  }
};