import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import crypto from 'crypto';
import { envConfig } from '../../config/env/env.config.js';
import { emailVerificationTemplate } from '../../template/emails/email.template.js';

//Génerer un token JWT
const generateToken = id => {
  return jwt.sign({ id }, envConfig.JWT_SECRET, {
    expiresIn: envConfig.JWT_EXPIRES_IN,
  });
};

//Générer un refresh token
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
  )}/api/auth/verify-email/${verificationToken}`;

  await sendEmail({
    email: user.email,
    subject: 'Vérification de votre adresse email - Mentorat',
    html: emailVerificationTemplate({ verificationURL }),
  });
  return verificationToken;
};

module.exports = {
  generateRefreshToken,
  generateToken,
  sendVerificationEmail,
};
