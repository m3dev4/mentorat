import asyncHandler from '../../middlewares/asyncHandler.middleware.js';
import Trainer from '../../models/trainer.model.js';

import { VerificatonEnumStatus } from '../../enums/vericationsStatus.enum.js';
import User from '../../models/user.model.js';
import AppError from '../../middlewares/appError.middleware.js';

//Devenir formatteur
export const becomeTrainer = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId || req.user._id || req.user.id;

  // Verifier si l'utilisateur est deja formateur
  const existingTrainer = await Trainer.findOne({ user: userId });
  if (existingTrainer) {
    return next(new AppError('Vous êtes deja inscrit comme formateur', 400));
  }

  //Extraire les données du formulaire
  try {
    const { biography, specializations, certifications, presentationVideo, languages } = req.body;

    //Creer le profil formateur
    const trainer = await Trainer.create({
      user: userId,
      biography,
      specializations,
      certifications,
      presentationVideo,
      languages,
      verificationStatus: VerificatonEnumStatus.PENDING,
    });

    //Mettre a jour le role de l'utilisateur
    await User.findByIdAndUpdate(userId, {
      $addToSet: { roles: 'formateur' },
    });
    res.status(201).json({
      status: 'success',
      message: 'Votre demande a été bien enregistrer',
      data: {
        trainer,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 500));
  }
});

// Obtenir les details du profil formateur
export const getTrainerProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId || req.user._id || req.user.id;

  const trainer = await Trainer.findOne({ user: userId }).populate(
    'user',
    'firstName lastName profilePicture',
  );

  if (!trainer) {
    return next(new AppError('Profil formateur non trouvé', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      trainer,
    },
  });
});

//Mettre a jour le profile formateur
export const updateTrainerProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId || req.user._id || req.user.id;

  try {
    const { verificationStatus, stats, courses, ...updateData } = req.body;

    const trainer = await Trainer.findOneAndUpdate({ user: userId }, updateData, {
      new: true,
      runValidators: true,
    }).populate('user', 'firstName lastName profilePicture');

    if (!trainer) {
      return next(new AppError('Profil formateur non trouvé', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        trainer,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 500));
  }
});

//Obtenir les disponibilités du formateur
export const getTrainerAvailability = asyncHandler(async (req, res, next) => {
  const { trainerId } = req.params;

  const trainer = await Trainer.findById(trainerId).select('availability');

  if (!trainer) {
    return next(new AppError('Profil formateur non trouvé', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      trainer,
    },
  });
});

//Mettre a jour les disponibilités du formateur
export const updateTrainerAvailability = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId || req.user._id || req.user.id;

  try {
    const { schedule, maxStudents, mentoringSession } = req.body;

    const trainer = await Trainer.findOneAndUpdate(
      { user: userId },
      {
        'availability.schedule': schedule || undefined,
        'availability.maxStudents': maxStudents || undefined,
        'availability.mentoringSession': mentoringSession || undefined,
      },
      { new: true, runValidators: true },
    );

    if (!trainer) {
      return next(new AppError('Profil formateur non trouvé', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        availability: trainer.availability,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 500));
  }
});

//lister tous les formateurs (public)
export const listTrainer = asyncHandler(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { verificationStatus: VerificatonEnumStatus.PENDING };

    if (req.query.specializations) {
      filter['specializations'] = req.query.specializations;
    }

    const trainers = await Trainer.find(filter)
      .populate('user', 'firstName lastName profilePicture')
      .skip(skip)
      .limit(limit)
      .sort({ 'stats.averageRating': -1 });

    const totalResults = await Trainer.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: trainers.length,
      totalPages: Math.ceil(totalResults / limit),
      currentPage: page,
      data: {
        trainers,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

//Obtenir les details d'un formateurs par ID (public)
export const getTrainerById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const trainer = await Trainer.findById(id)
    .populate('user', 'firstName, lastName, profilePicture')
    .populate('courses', 'title subtitle coverImage rating');

  if (!trainer) {
    return next(new AppError('Formateur non trouvé', 404));
  }

  if (trainer.verificationStatus !== verificationEnumsStatus.VERIFIED) {
    const isAdmin = req.user && req.user.roles.includes('administrateur');
    const isOwner = req.user && req.user.id === trainer.user._id.toString();
    if (!isAdmin && !isOwner) {
      return next(new AppError("Vous n'avez pas la permission de voir ce profil", 403));
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      trainer,
    },
  });
});

//Verifier/approuver un formateur (admin)
export const verifyTrainer = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!Object.values(VerificatonEnumStatus).include(status)) {
    return next(new AppError('Status invalide', 400));
  }

  const trainer = await Trainer.findByIdAndUpdate(
    id,
    { verificationStatus: status },
    { new: true },
  );
  if (!trainer) {
    return new new AppError('Formateur non trouvé', 404)();
  }
  res.status(200).json({
    status: 'success',
    data: {
      trainer,
    },
  });
});

//ajouter un badge a un formateur (admin)
export const addTrainerBadge = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, imageUrl } = req.body;

  const trainer = await Trainer.findByIdAndUpdate(
    id,
    {
      $push: {
        badges: {
          name,
          description,
          imageUrl,
          awardedDate: new Date(),
        },
      },
    },
    { new: true },
  );

  if (!trainer) {
    return next(new AppError('Formateur non trouvé', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      trainer,
    },
  });
});
