import nodemailer from 'nodemailer';
import { envConfig } from '../config/env/env.config';

export const emailConfig = {
  host: envConfig.EMAIL_HOST,
  port: envConfig.EMAIL_PORT,
  secure: false,
  auth: {
    user: envConfig.EMAIL_USERNAME,
    pass: envConfig.EMAIL_PASSWORD,
  },
};

export const transporter = nodemailer.createTransport(emailConfig);
