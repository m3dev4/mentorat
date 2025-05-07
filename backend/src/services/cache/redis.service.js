import { redisClient } from '../../config/cache/redis.config.js';

/**
 * Service de cache utilisant Redis
 */

class CacheService {
  constructor() {
    this.client = redisClient;
    this.defaultTTL = 1600; // 1 heures par defaut
  }

  /**
   * Recuper une valeur du cache
   * @param {string} key - clé de la cache
   * @returns {Promise<any>} - valeur mise en cache ou null
   */
  async get(key) {
    try {
      const cachedData = await this.client.get(key);
      if (!cachedData) return null;
      return JSON.parse(cachedData);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de la valeur du cache pour: ${key}`,
        error.message,
      );
      return null;
    }
  }

  /**
   * Stocke une valeur dans la cache
   * @param {string} key - clé de cache
   * @param {any} value - valeur à mettre en cache
   * @param {number} ttl - durée de vie de la valeur en secondes
   * @Returns {Promsie<boolean>} - success de l'operation
   */
  async set(key, value, ttl = this.defaultTTL) {
    try {
      const stringValue = JSON.stringify(value);
      await this.client.set(key, stringValue, { EX: ttl });
      return true;
    } catch (error) {
      console.error(`Erreur lors de la mise en cache de la valeur pour: ${key}`, error.message);
      return false; // En cas d'erreur, on continue sans cache
    }
  }

  /**
   * Supprimer toutes les valeurs correspondant à un motif
   * @param {string} pattern - motif de recherche
   * @returns {Promise<boolean>} - success de l'operation
   */
  async deletePattern(pattern) {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return true;
    } catch (error) {
      console.error(
        `Erreur lors de la suppression des valeurs correspondant au motif: ${pattern}`,
        error.message,
      );
      return false; // En cas d'erreur, on continue sans cache
    }
  }

  /**
   * Verifier si une clé existe dans la cache
   * @param {string} -key - Clé de cache
   * @returns {Promise<boolean>} - Existence de la clé
   */
  async exists(key) {
    try {
      return (await this.client.exists(key)) === 1;
    } catch (error) {
      console.error(`Erreur lors de la vérification de la clé: ${key}`, error.message);
      return false; // En cas d'erreur, on continue sans cache
    }
  }

  /**
   * Supprimer une valeur spécifique du cache
   * @param {string} key - clé à supprimer
   * @returns {Promise<boolean>} - succès de l'opération
   */
  async delete(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la clé: ${key}`, error.message);
      return false; // En cas d'erreur, on continue sans cache
    }
  }
}

export const cacheService = new CacheService();
