import Redis from 'ioredis';
import { Queue } from 'bullmq';
import { databaseConfig } from '../../common/config';

// Crear cliente Redis con la configuración del .env
export const redisClient = new Redis({
  host: databaseConfig.redis.host,
  port: databaseConfig.redis.port,
  password: databaseConfig.redis.password,
});

export const buyIngredientQueue = new Queue('buyIngrediente', {
  connection: { port: databaseConfig.redis.port, host: databaseConfig.redis.host },
});

export const sendIngredientQueue = new Queue('ingredientReady', {
  connection: { port: databaseConfig.redis.port, host: databaseConfig.redis.host },
});

console.log('🔴 Redis connected for Pub/Sub');
