import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import crypto from 'crypto';
import { envConfig } from '../../config/env/env.config.js';
import { emailVerificationTemplate } from '../../template/emails/email.template.js';
import { sendEmail } from '../../mailers/mailer.js';

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
  )}/api/v1/auth/verify-email/${verificationToken}`;

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

export { generateRefreshToken, generateToken, sendVerificationEmail };
