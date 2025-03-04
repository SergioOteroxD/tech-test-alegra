import { EwarehouseEvent } from '../../common/enum/warehouse-event.enum';
import { EventDriver } from '../../drivers/repositories/event.driver.impl';

export class EventUC {
  private static instance: EventUC;
  private eventDriver: EventDriver;

  constructor() {
    this.eventDriver = EventDriver.getInstance();
  }

  // Método para obtener la instancia única
  public static getInstance(): EventUC {
    if (!EventUC.instance) {
      EventUC.instance = new EventUC();
    }
    return EventUC.instance;
  }

  async publish(channel: EwarehouseEvent, data: any): Promise<any> {
    this.eventDriver.publish(channel, data);
  }

  async subscribe(channels: EwarehouseEvent[]): Promise<any> {
    return await this.eventDriver.subscribe(channels);
  }

  async psubscribe(channels: EwarehouseEvent[]): Promise<any> {
    return await this.eventDriver.psubscribe(channels);
  }

  async on(event: string, cb: (...args: any[]) => void): Promise<any> {
    return this.eventDriver.on(event, cb);
  }
}
