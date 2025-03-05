import Redis from 'ioredis';
import { publisherClient, subscriberClient } from '../database/redis.connect';
import { EwarehouseEvent } from '../../common/enum/warehouse-event.enum';

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

  async publish<T>(channel: EwarehouseEvent, data: T): Promise<any> {
    this.redisPubDriver.publish(channel, JSON.stringify(data));
  }

  async subscribe(channels: EwarehouseEvent[]): Promise<any> {
    const channelStrings = channels.map((channel) => channel.toString());
    return await this.redisSubDriver.subscribe(...channelStrings, (err, count) => {
      if (err) {
        console.error('❌ Error al suscribirse a Redis:', err);
      } else {
        console.log(`🔔 Suscrito a ${count} canal(es)`);
      }
    });
  }

  async psubscribe(channels: EwarehouseEvent[]): Promise<any> {
    const channelStrings = channels.map((channel) => channel.toString());
    return await this.redisSubDriver.psubscribe(...channelStrings);
  }

  async on(event: string, cb: (...args: any[]) => void): Promise<any> {
    return this.redisSubDriver.on(event, cb);
  }
}
