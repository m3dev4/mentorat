import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import crypto from 'crypto';
import { envConfig } from '../../config/env/env.config.js';
import { emailVerificationTemplate } from '../../template/emails/email.template.js';
import { sendEmail } from '../../mailers/mailer.js';
import { cacheService } from '../cache/redis.service.js';

// Génerer un token JWT
const generateToken = id => {
  return jwt.sign({ id }, envConfig.JWT_SECRET, {
    expiresIn: envConfig.JWT_EXPIRES_IN,
  });
};

// Générer un refresh token
const generateRefreshToken = id => {
  return jwt.sign({ id }, envConfig.JWT_REFRESH_SECRET, {
    expiresIn: envConfig.JWT_REFRESH_EXPIRES_IN,
  });
};

// Envoyer un email de vérification
const sendVerificationEmail = async (user, req) => {
  // Créer un token de vérification
  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Construire l'URL de vérification
  const verificationURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/verify-email/${verificationToken}`;

  // Stocker le token dans le cache pour une vérification rapide
  await cacheService.set(
    `email_verification:${verificationToken}`,
    user.id,
    24 * 60 * 60, // 24 heures
  );

  // En développement, afficher les informations dans la console
  if (envConfig.NODE_ENV !== 'production') {
    console.log('===== MODE DÉVELOPPEMENT =====');
    console.log(`Email de vérification pour: ${user.email}`);
    console.log(`Sujet: Vérification de votre adresse email - Mentorat`);
    console.log(`URL de vérification: ${verificationURL}`);
    console.log('=============================');
  }

  // Envoyer l'email réel (en développement et en production)
  try {
    await sendEmail({
      email: user.email,
      subject: 'Vérification de votre adresse email - Mentorat',
      html: emailVerificationTemplate(verificationURL),
    });
    console.log(`Email envoyé avec succès à ${user.email}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error.message);
    console.log('\n===== INSTRUCTIONS POUR CONFIGURER GMAIL =====');
    console.log("1. Activez l'authentification à deux facteurs sur votre compte Gmail");
    console.log("2. Créez un mot de passe d'application spécifique pour votre application");
    console.log('3. Utilisez ce mot de passe dans votre fichier .env');
    console.log("Plus d'informations: https://support.google.com/accounts/answer/185833");
    console.log('===========================================\n');
    // Ne pas bloquer le processus d'inscription si l'email échoue
  }

  return verificationToken;
};

// Vérifier si un token est dans la liste noire (déconnexion)
const isTokenBlacklisted = async token => {
  return await cacheService.exists(`blacklist:${token}`);
};

// Ajouter un token à la liste noire lors de la déconnexion
const blacklistToken = async (token, expiresIn) => {
  // Convertir expiresIn (ex: '1h') en secondes
  let ttl = 3600; // 1 heure par défaut
  if (typeof expiresIn === 'string') {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    if (unit === 'h') ttl = value * 3600;
    else if (unit === 'd') ttl = value * 86400;
    else if (unit === 'm') ttl = value * 60;
  }

  return await cacheService.set(`blacklist:${token}`, true, ttl);
};

// Récupérer un utilisateur avec mise en cache
const getUserById = async userId => {
  // Essayer de récupérer l'utilisateur depuis le cache
  const cacheKey = `user:${userId}`;
  const cachedUser = await cacheService.get(cacheKey);

  if (cachedUser) {
    console.log(`Utilisateur ${userId} récupéré depuis le cache`);
    return cachedUser;
  }

  // Si non trouvé dans le cache, récupérer depuis la base de données
  const user = await User.findById(userId);

  if (user) {
    // Mettre en cache pour les prochaines requêtes (15 minutes)
    const userObject = user.toObject();
    // Ne pas mettre le mot de passe en cache
    delete userObject.password;
    await cacheService.set(cacheKey, userObject, 15 * 60);
    console.log(`Utilisateur ${userId} mis en cache`);
  }

  return user;
};

// Invalider le cache utilisateur lors des mises à jour
const invalidateUserCache = async userId => {
  console.log(`Invalidation du cache pour l'utilisateur ${userId}`);
  return await cacheService.delete(`user:${userId}`);
};

export {
  generateRefreshToken,
  generateToken,
  sendVerificationEmail,
  isTokenBlacklisted,
  blacklistToken,
  getUserById,
  invalidateUserCache,
};
