import Redis from 'ioredis';
import Queue from 'bull';
import { databaseConfig } from '../../common/config';

// Crear cliente Redis con la configuración del .env
export const redisClient = new Redis({
  host: databaseConfig.redis.host,
  port: databaseConfig.redis.port,
  password: databaseConfig.redis.password,
});

export const buyIngredientQueue = new Queue('buyIngrediente', {
  redis: { port: databaseConfig.redis.port, host: databaseConfig.redis.host },
});

export const sendIngredientQueue = new Queue('ingredientReady', {
  redis: { port: databaseConfig.redis.port, host: databaseConfig.redis.host },
});

console.log('🔴 Redis connected for Pub/Sub');
