import { redisClient } from '../config/cache/redis.config.js';
import AppError from './appError.middleware.js';

/**
 * Middleware pour limiter le nombre de requêtes
 * @param {number} maxRequests - Nombre maximum de requêtes
 * @param {number} windowMs - Fenêtre de temps en millisecondes
 * @returns {Function} - Middleware Express
 */
export const rateLimit = (maxRequests = 100, windowMs = 60 * 60 * 1000) => {
  return async (req, res, next) => {
    try {
      // Identifier l'utilisateur par son IP ou son ID s'il est connecté
      const identifier = req.user ? `user:${req.user._id}` : `ip:${req.ip}`;
      const key = `ratelimit:${identifier}`;

      // Récupérer le nombre de requêtes actuel
      const current = await redisClient.get(key);
      const requestCount = current ? parseInt(current) : 0;

      // Vérifier si la limite est atteinte
      if (requestCount >= maxRequests) {
        return next(new AppError('Trop de requêtes, veuillez réessayer plus tard', 429));
      }

      // Incrémenter le compteur
      if (requestCount === 0) {
        // Première requête, définir le TTL
        await redisClient.set(key, 1, {
          EX: Math.floor(windowMs / 1000),
        });
      } else {
        // Incrémenter le compteur existant
        await redisClient.incr(key);
      }

      // Ajouter les en-têtes de limite de taux
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - requestCount - 1);

      next();
    } catch (error) {
      console.error('Erreur lors de la vérification de la limite de taux:', error);
      // En cas d'erreur, continuer sans limite de taux
      next();
    }
  };
};

// Middleware pour les routes d'authentification (plus restrictif)
export const authRateLimit = rateLimit(20, 15 * 60 * 1000); // 20 requêtes par 15 minutes

// Middleware pour les routes générales
export const apiRateLimit = rateLimit(100, 60 * 60 * 1000); // 100 requêtes par heure
