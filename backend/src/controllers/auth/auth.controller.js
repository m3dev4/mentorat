import AppError from '../../middlewares/appError.middleware.js';
import asyncHandler from '../../middlewares/asyncHandler.middleware.js';
import User from '../../models/user.model.js';
import {
  generateToken,
  generateRefreshToken,
  sendVerificationEmail,
} from '../../services/auth/auth.service.js';

// Fonction utilitaire pour envoyer les tokens de reponse
const sendTokenResponse = (user, statusCode, req, res) => {
  // Generer les token
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Option pour le cookie
  const cookieOptions = {
    expires: new Date(Date.now() + (user.stayConnected ? 30 : 1) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  // Envoyer les cookies
  res.cookie('jwt', token, cookieOptions);
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    path: '/api/v1/auth/refresh-token',
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user,
    },
  });
};

// Enregistrer un nouvel utilisateur
export const register = asyncHandler(async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // verifier si l'utilisateur existe deja
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError("L'utilisateur existe deja", 400));
    }

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    // Envoyer un email de vérification
    await sendVerificationEmail(newUser, req);

    // Envoyer la réponse avec le token
    sendTokenResponse(newUser, 201, req, res);
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError("L'email est deja utilise", 400));
    }

    if (error.name === 'ValidationError') {
      return next(new AppError(error.message, 400));
    }
    next(error);
  }
});
