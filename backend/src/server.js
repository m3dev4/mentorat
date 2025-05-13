import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import { envConfig } from './config/env/env.config.js';
import ConnectDb from './config/db/connectDB.js';
import { initializeTransporter } from './mailers/mailer.js';
import { connectRedis } from './config/cache/redis.config.js';
import { apiRateLimit } from './middlewares/rateLimit.middleware.js';

import authRoutes from './routes/auth/auth.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: envConfig.FRONTEND_URL,
  
  credentials: true,
}));
app.use(morgan('dev'));

// Appliquer la limite de taux globale
app.use(apiRateLimit);

app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({
    message:
      "Si vous voyez ce message, c'est que le serveur de Mentorat est en cours de fonctionnement",
    status: 'success',
  });
});

app.listen(envConfig.PORT, async () => {
  // Connexion à la base de données
  ConnectDb();

  // Initialisation du transporteur d'emails
  try {
    const emailTransporter = await initializeTransporter();
    console.log("Transporteur d'emails initialisé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'initialisation du transporteur d'emails:", error.message);
  }

  // Connexion à Redis
  try {
    const redisClient = await connectRedis();
    if (redisClient) {
      console.log('Connexion à Redis établie avec succès');
    } else {
      console.warn("Redis n'est pas disponible - le système fonctionnera sans cache");
    }
  } catch (error) {
    console.error('Erreur lors de la connexion à Redis:', error.message);
    console.warn("L'application continuera à fonctionner sans Redis");
  }

  console.log(`Le serveur Mentorat est démarré sur le port ${envConfig.PORT}`);
});

export default app;
