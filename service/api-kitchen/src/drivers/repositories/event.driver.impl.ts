import Redis from 'ioredis';
import { publisherClient, subscriberClient } from '../database/redis.connect';

export class EventDriver {
  private static instance: EventDriver;
  private redisPubDriver: Redis;
  private redisSubDriver: Redis;

  constructor() {
    this.redisPubDriver = publisherClient;
    this.redisSubDriver = subscriberClient;
  }

  // Método para obtener la instancia única
  public static getInstance(): EventDriver {
    if (!EventDriver.instance) {
      EventDriver.instance = new EventDriver();
    }
    return EventDriver.instance;
  }

  async publish(channel: string, data: any): Promise<any> {
    console.log(`💡 Mensaje recibido en el canal ${channel}:`, data);
    return await this.redisPubDriver.publish(channel, JSON.stringify(data));
  }

  async subscribe(channels: string[]): Promise<any> {
    return await this.redisSubDriver.subscribe(...channels);
  }

  async on(cb: (channel: string, message: string) => void): Promise<any> {
    return this.redisSubDriver.on('message', cb);
  }
}
