import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { envConfig } from './config/env/env.config.js';
import ConnectDb from './config/db/connectDB.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(envConfig.PORT, () => {
  ConnectDb()
  console.log(`Le serveur Mentorat est démarré sur le port ${envConfig.PORT}`);
});

export default app;
