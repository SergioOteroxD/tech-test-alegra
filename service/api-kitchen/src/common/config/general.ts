import dotenv from 'dotenv';
import type { StringValue } from 'ms';

dotenv.config(); // Cargar variables de entorno

export const config = {
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL || 'api',
  version: process.env.VERSION || '1',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpire: process.env.EXPIRES_JWT as StringValue || '1h',
};