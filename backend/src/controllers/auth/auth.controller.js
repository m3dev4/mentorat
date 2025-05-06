import { envConfig } from '../../config/env/env.config.js';
import AppError from '../../middlewares/appError.middleware.js';
import asyncHandler from '../../middlewares/asyncHandler.middleware.js';
import User from '../../models/user.model.js';
import {
  generateToken,
  generateRefreshToken,
  sendVerificationEmail,
} from '../../services/auth/auth.service.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

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

// Connexion d'un utilisateur
export const login = asyncHandler(async (req, res, next) => {
  const { email, password, stayConnected } = req.body;

  // Verifier si l'email et le mdp sont fournir
  if (!email || !password) {
    return next(new AppError('Veuillez fournir un email et un mot de passe', 400));
  }
  // Trouver l'utilisateur par email et inclure le mot de passe
  const user = await User.findOne({ email }).select('+password');
  // Verifier si l'utilsiateur existe et si le mdp est correct
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Email ou mot de passe incorrect', 401));
  }
  // Mettre à jour l'option rester conncetr si fournir
  if (stayConnected !== undefined) {
    user.stayConnected = stayConnected;
    await user.save({ validateBeforeSave: false });
  }
  // Enregistrer les information de connexion
  const loginInfo = {
    date: Date.now(),
    ip: req.ip,
    device: req.headers['user-agent'],
    location: 'Non disponible',
  };
  user.loginHistory.push(loginInfo);
  user.lastActive = Date.now();
  await user.save({ validateBeforeSave: false });

  // Envoyer la reponse avec le token
  sendTokenResponse(user, 200, req, res);
});

// Deconnexion
export const logout = asyncHandler(async (req, res, next) => {
  // Effacer les cookies
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.cookie('refreshToken', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    path: '/api/v1/auth/refresh-token',
  });

  res.status(200).json({ status: 'success', message: 'Deconnexion reussie' });
});

// Vérification de l'email
export const verifyEmail = asyncHandler(async (req, res, next) => {
  //Recurperer le token
  const { token } = req.params;

  // Hasher le token pour le comparer avec celui stocké en base
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  //Trouver l'utilisateur avec le token et verifier qu'il n'est pas exiprer
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token invalide ou expiré', 400));
  }
  // Marquer l'email comme verifier et supprimer le token
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // Rediriger vers la page de connexion ou envoyer une reponse JSON
  res.status(200).json({
    status: 'success',
    message: 'Email verifié avec succès',
  });
});

// Renvoyer un email de vérification
export const resendVerificationEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Veuillez fournir un email', 400));
  }

  // Touver l'utilisateur par email
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('Aucun utilisateur trouvé avec ce email', 404));
  }

  if (user.isEmailVerified) {
    return next(new AppError('Email deja verifié', 400));
  }

  await sendVerificationEmail(user, req);

  res.status(200).json({
    status: 'success',
    message: 'Email de verification reenvoyer avec succes',
  });
});

export const rafreshToken = asyncHandler(async (req, res, next) => {
  // recuperer le refreshToken
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new AppError('Veuillez vous reconnecter', 401));
  }
  const decoded = jwt.verify('refreshToken', envConfig.JWT_REFRESH_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }
  sendTokenResponse(user, 200, req, res);
});
