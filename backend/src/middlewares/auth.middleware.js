import { envConfig } from '../config/env/env.config.js';
import User from '../models/user.model.js';
import AppError from './appError.middleware.js';
import asyncHandler from './asyncHandler.middleware.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { isTokenBlacklisted, getUserById } from '../services/auth/auth.service.js';

const protect = asyncHandler(async (req, res, next) => {
  try {
    //Verifier si le token existe
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError("Vous n'êtes pas authentifié", 401));
    }

    // Vérifier si le token est dans la liste noire (déconnecté)
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return next(new AppError('Token invalide ou expiré. Veuillez vous reconnecter.', 401));
    }

    //Verifier si le token est valide
    const decoded = await promisify(jwt.verify)(token, envConfig.JWT_SECRET);

    //Verifier si l'utilisateur existe (avec cache)
    const currentUser = await getUserById(decoded.id);

    if (!currentUser) {
      return next(new AppError("L'utilisateur associé à ce token n'existe pas.", 401));
    }

    // Stocker l'utilisateur dans req.user
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token invalide. Veullez vous reconnecter.', 401));
    }

    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expiré. Veullez vous reconnecter.', 401));
    }

    next(error);
  }
});

//Middleware pour restreindre l'acces aux rôles specifique
const restrictTo = (...roles) => {
  return (req, res, next) => {
    //Vérifier si l'utilisateur a eu moins un des rôles requis
    const hasRequiredRole = req.user.roles.some(role => role.includes(roles));
    if (!hasRequiredRole) {
      return next(new AppError("Vous n'avez pas la permission d'effectuer cette action", 403));
    }
    next();
  };
};

// Middleware pour verifier si l'email est vérifié
const isEmailVerified = asyncHandler(async (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return next(new AppError('Veuillez vérifier votre adresse email', 403));
  }
  next();
});

export { protect, restrictTo, isEmailVerified };
