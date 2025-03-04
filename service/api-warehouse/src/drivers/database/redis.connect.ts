import Redis from 'ioredis';
import Queue from 'bull';
import { databaseConfig } from '../../common/config';

// Crear cliente Redis con la configuración del .env
export const redisClient = new Redis({
  host: databaseConfig.redis.host,
  port: databaseConfig.redis.port,
  password: databaseConfig.redis.password,
});

export const publisherClient = new Redis({ host: databaseConfig.redis.host, port: databaseConfig.redis.port });
export const subscriberClient = new Redis({ host: databaseConfig.redis.host, port: databaseConfig.redis.port });

export const taskQueue = new Queue('buyIngrediente', {
  redis: { port: databaseConfig.redis.port, host: databaseConfig.redis.host },
});

console.log('🔴 Redis connected for Pub/Sub');

redisClient.on('connect', () => {
  console.log('🔗 Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});
