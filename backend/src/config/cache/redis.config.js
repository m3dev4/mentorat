import { createClient } from 'redis';

//Configuration du client Redis
const redisClient = createClient({
  url: 'redis://127.0.0.1:6379',
  socket: {
    reconnectStrategy: retries => {
      return Math.min(retries * 50 * 3000);
    },
  },
});

// Gestion des evenement Redis
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', err => {
  console.log('Redis client error', err);
});

redisClient.on('reconnecting', () => {
  console.log('Redis client reconnecting');
});

// Init de la connexion Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Erreur lors de la connexion Redis', error);
    return null;
  }
};

export { redisClient, connectRedis };
