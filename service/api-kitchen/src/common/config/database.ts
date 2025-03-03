import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno
export const databaseConfig = {
  postgres: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    timeOut: process.env.REDIS_TIME_OUT ? parseInt(process.env.REDIS_TIME_OUT) : 120,
    password: process.env.REDIS_PASSWORD || undefined,
  },
};
