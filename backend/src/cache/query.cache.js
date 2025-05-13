import { cacheService } from './redis.service.js';

/**
 * Wrapper pour mettre en cache les résultats de requêtes
 * @param {Function} queryFn - Fonction de requête à exécuter
 * @param {string} cacheKey - Clé de cache
 * @param {number} ttl - Durée de vie en secondes
 * @returns {Promise<any>} - Résultat de la requête
 */
export const cacheQuery = async (queryFn, cacheKey, ttl = 3600) => {
  try {
    // Vérifier si le résultat est en cache
    const cachedResult = await cacheService.get(cacheKey);
    if (cachedResult) {
      console.log(`Résultat récupéré depuis le cache pour: ${cacheKey}`);
      return cachedResult;
    }

    // Exécuter la requête
    const result = await queryFn();

    // Mettre en cache le résultat
    if (result) {
      await cacheService.set(cacheKey, result, ttl);
      console.log(`Résultat mis en cache pour: ${cacheKey}`);
    }

    return result;
  } catch (error) {
    console.error(`Erreur lors de la mise en cache de la requête: ${error.message}`);
    // En cas d'erreur, exécuter la requête sans cache
    return await queryFn();
  }
};

/**
 * Invalider le cache pour une clé ou un motif
 * @param {string} keyOrPattern - Clé ou motif à invalider
 * @param {boolean} isPattern - Indique si c'est un motif
 * @returns {Promise<boolean>} - Succès de l'opération
 */
export const invalidateCache = async (keyOrPattern, isPattern = false) => {
  try {
    if (isPattern) {
      return await cacheService.deletePattern(keyOrPattern);
    } else {
      return await cacheService.delete(keyOrPattern);
    }
  } catch (error) {
    console.error(`Erreur lors de l'invalidation du cache: ${error.message}`);
    return false;
  }
};
