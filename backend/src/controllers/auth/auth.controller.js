import { envConfig } from '../../config/env/env.config.js';
import AppError from '../../middlewares/appError.middleware.js';
import asyncHandler from '../../middlewares/asyncHandler.middleware.js';
import User from '../../models/user.model.js';
import {
  generateToken,
  generateRefreshToken,
  sendVerificationEmail,
  blacklistToken,
  invalidateUserCache,
} from '../../services/auth/auth.service.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { cacheService } from '../../services/cache/redis.service.js';

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
    
    // Vérifier si l'utilisateur existe déjà (avec cache)
    const cacheKey = `email:${email}`;
    let userExists = await cacheService.get(cacheKey);
    
    if (!userExists) {
      userExists = await User.findOne({ email });
      // Mettre en cache le résultat pour 5 minutes
      if (userExists) {
        await cacheService.set(cacheKey, true, 5 * 60);
      }
    }
    
    if (userExists) {
      return next(new AppError("L'utilisateur existe déjà", 400));
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
      return next(new AppError("L'email est déjà utilisé", 400));
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

  // Verifier si l'email et le mdp sont fournis
  if (!email || !password) {
    return next(new AppError('Veuillez fournir un email et un mot de passe', 400));
  }
  
  // Essayer de récupérer l'utilisateur depuis le cache
  const cacheKey = `login:${email}`;
  let user = await cacheService.get(cacheKey);
  
  if (!user) {
    // Trouver l'utilisateur par email et inclure le mot de passe
    user = await User.findOne({ email }).select('+password');
    
    // Ne pas mettre en cache les informations sensibles comme le mot de passe
    // Mais on peut mettre en cache l'existence de l'utilisateur
    if (user) {
      const userWithoutPassword = { ...user.toObject() };
      delete userWithoutPassword.password;
      // Mettre en cache pour 5 minutes
      await cacheService.set(`user:${userWithoutPassword._id}`, userWithoutPassword, 5 * 60);
    }
  } else {
    // Si l'utilisateur est récupéré du cache, on doit quand même obtenir le mot de passe
    user = await User.findById(user._id).select('+password');
  }
  
  // Verifier si l'utilisateur existe
  if (!user) {
    return next(new AppError('Email ou mot de passe incorrect', 401));
  }
  
  // Vérifier si le mot de passe est correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new AppError('Email ou mot de passe incorrect', 401));
  }
  
  // Mettre à jour l'option rester connecté si fournie
  if (stayConnected !== undefined) {
    user.stayConnected = stayConnected;
    await user.save({ validateBeforeSave: false });
    // Invalider le cache pour cet utilisateur
    await invalidateUserCache(user._id);
  }
  
  // Enregistrer les informations de connexion
  const loginInfo = {
    date: Date.now(),
    ip: req.ip,
    device: req.headers['user-agent'],
    location: 'Non disponible',
  };
  user.loginHistory.push(loginInfo);
  user.lastActive = Date.now();
  await user.save({ validateBeforeSave: false });
  
  // Invalider le cache pour cet utilisateur
  await invalidateUserCache(user._id);

  // Envoyer la réponse avec le token
  sendTokenResponse(user, 200, req, res);
});

// Déconnexion
export const logout = asyncHandler(async (req, res, next) => {
  // Récupérer le token
  const token = req.cookies.jwt || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  if (token) {
    // Ajouter le token à la liste noire dans Redis
    await blacklistToken(token, envConfig.JWT_EXPIRES_IN);
  }
  
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

  res.status(200).json({ status: 'success', message: 'Déconnexion réussie' });
});

// Vérification de l'email
export const verifyEmail = asyncHandler(async (req, res, next) => {
  //Récupérer le token
  const { token } = req.params;

  // Vérifier d'abord dans le cache
  const userId = await cacheService.get(`email_verification:${token}`);
  let user;
  
  if (userId) {
    user = await User.findById(userId);
  } else {
    // Hasher le token pour le comparer avec celui stocké en base
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Trouver l'utilisateur avec le token et vérifier qu'il n'est pas expiré
    user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });
  }

  if (!user) {
    return next(new AppError('Token invalide ou expiré', 400));
  }
  
  // Marquer l'email comme vérifié et supprimer le token
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });
  
  // Supprimer du cache
  await cacheService.delete(`email_verification:${token}`);
  // Invalider le cache utilisateur
  await invalidateUserCache(user._id);

  // Rediriger vers la page de connexion ou envoyer une réponse JSON
  res.status(200).json({
    status: 'success',
    message: 'Email vérifié avec succès',
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

export const refreshToken = asyncHandler(async (req, res, next) => {
  // recuperer le refreshToken
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new AppError('Veuillez vous reconnecter', 401));
  }
  // Corriger la référence à la variable d'environnement
  const decoded = jwt.verify(refreshToken, envConfig.JWT_SECRET_REFRESH);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }
  sendTokenResponse(user, 200, req, res);
});

// User profile
export const getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

// Mettre à jour le mot de passe
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new AppError('Mot de passe actuel incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, req, res);
});

// Profile mettre à jour
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { bio, location, profilePicture, languages, timezone } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }
  user.bio = bio;
  user.location = location;
  user.profilePicture = profilePicture;
  user.languages = languages;
  user.timezone = timezone;

  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
