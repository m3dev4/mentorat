import dotenv from 'dotenv';

import { getEnv } from '../../common/utils/get.env.js';

dotenv.config();
const appConfig = () => ({
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: getEnv('PORT', 3000),
  DOCKERHUB_USERNAME: getEnv('DOCKERHUB_USERNAME'),
  DOCKERHUB_TOKEN: getEnv('DOCKERHUB_TOKEN'),
  MONGODB_URI: getEnv('MONGODB_URI'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN'),
  JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: getEnv('JWT_REFRESH_EXPIRES_IN'),
});

export const envConfig = appConfig();
