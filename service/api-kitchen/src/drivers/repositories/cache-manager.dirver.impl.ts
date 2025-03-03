import Redis from 'ioredis';
import { redisClient } from '../database/redis.connect';

export class CacheDriver {
  private static instance: CacheDriver;
  private redisDriver: Redis;

  constructor() {
    this.redisDriver = redisClient;
  }

  // Método para obtener la instancia única
  public static getInstance(): CacheDriver {
    if (!CacheDriver.instance) {
      CacheDriver.instance = new CacheDriver();
    }
    return CacheDriver.instance;
  }

  async get(key: string): Promise<any> {
    const data = await this.redisDriver.get(key);
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    return data;
  }

  async set(key: string, data: any, seg: number = 3600): Promise<any> {
    return await this.redisDriver.set(key, JSON.stringify(data), 'EX', seg);
  }
}
