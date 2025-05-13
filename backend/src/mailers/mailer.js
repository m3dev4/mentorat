import nodemailer from 'nodemailer';
import { envConfig } from '../config/env/env.config.js';

// Créer un transporteur directement avec Gmail
let transporter;

/**
 * Initialise le transporteur nodemailer
 * Utilise directement Gmail pour l'envoi d'emails
 */
export const initializeTransporter = async () => {
  // Créer le transporteur avec les paramètres Gmail
  transporter = nodemailer.createTransport({
    service: 'gmail', // Utiliser le service préconfiguré Gmail
    host: envConfig.EMAIL_HOST, // smtp.gmail.com
    port: envConfig.EMAIL_PORT, // 587
    secure: envConfig.EMAIL_SECURE === 'true',
    auth: {
      user: envConfig.EMAIL_USERNAME,
      pass: envConfig.EMAIL_PASSWORD.trim(), // Supprimer les espaces éventuels
    },
    tls: {
      // Désactiver la vérification des certificats pour Gmail
      rejectUnauthorized: false,
    },
    debug: true, // Activer le débogage pour voir plus d'informations
  });

  // Vérifier que la connexion fonctionne
  try {
    await transporter.verify();
    console.log('Connexion au serveur SMTP établie avec succès');
  } catch (error) {
    console.error('Erreur de connexion au serveur SMTP:', error.message);
  }

  return transporter;
};

// Initialiser le transporteur immédiatement
initializeTransporter();

/**
 * Send an email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @returns {Promise} - Nodemailer send mail promise
 */
export const sendEmail = async options => {
  // S'assurer que le transporteur est initialisé
  if (!transporter) {
    await initializeTransporter();
  }

  const mailOptions = {
    from: `Mentorat <${envConfig.EMAIL_FROM || 'noreply@mentorat.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);

  // En développement, afficher l'URL de prévisualisation Ethereal
  if (envConfig.NODE_ENV !== 'production') {
    console.log("URL de prévisualisation de l'email:", nodemailer.getTestMessageUrl(info));
  }

  return info;
};
