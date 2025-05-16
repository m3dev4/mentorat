import dotenv from 'dotenv';

import { getEnv } from '../../common/utils/get.env.js';

dotenv.config();
const appConfig = () => {
  // Déterminer si nous sommes en développement
  const isDevelopment = getEnv('NODE_ENV', 'development') === 'development';

  // Valeurs par défaut pour le développement
  const DEV_JWT_SECRET = 'dev_jwt_secret_ne_pas_utiliser_en_production';
  const DEV_JWT_REFRESH_SECRET = 'dev_jwt_refresh_secret_ne_pas_utiliser_en_production';

  return {
    NODE_ENV: getEnv('NODE_ENV', 'development'),
    PORT: getEnv('PORT', 5000),
    DOCKERHUB_USERNAME: getEnv('DOCKERHUB_USERNAME'),
    DOCKERHUB_TOKEN: getEnv('DOCKERHUB_TOKEN'),
    MONGODB_URI: getEnv('MONGODB_URI'),
    POSTGRES_URI: getEnv('POSTGRES_URI'),
    // Utiliser des valeurs par défaut pour les secrets JWT en développement
    JWT_SECRET: getEnv('JWT_SECRET_KEY', isDevelopment ? DEV_JWT_SECRET : ''),
    JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '30d'),
    JWT_REFRESH_SECRET: getEnv('JWT_SECRET_REFRESH', isDevelopment ? DEV_JWT_REFRESH_SECRET : ''),
    JWT_REFRESH_EXPIRES_IN: getEnv('JWT_REFRESH_EXPIRES_IN', '90d'),
    EMAIL_HOST: getEnv('EMAIL_HOST'),
    EMAIL_PORT: getEnv('EMAIL_PORT'),
    EMAIL_USERNAME: getEnv('EMAIL_USER'),
    EMAIL_PASSWORD: getEnv('EMAIL_PASSWORD'),
    EMAIL_FROM: getEnv('EMAIL_FROM', 'noreply@mentorat.com'),
    FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:5173'),
  };
};

export const envConfig = appConfig();
