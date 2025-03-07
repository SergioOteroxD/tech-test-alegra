import { webSocket } from '../../index';
import { EwebSocketEvent } from '../../common/enum/web-socket.event';

export class WebSocketDriver {
  private static instance: WebSocketDriver;

  constructor() {}

  // Método para obtener la instancia única
  public static getInstance(): WebSocketDriver {
    if (!WebSocketDriver.instance) {
      WebSocketDriver.instance = new WebSocketDriver();
    }
    return WebSocketDriver.instance;
  }

  on(ev: string, callback: (...args: any[]) => void): void {
    webSocket.on(ev, callback);
  }

  broadcast(event: EwebSocketEvent, data: any): void {
    webSocket.emit(event, data);
  }

  sendToClient(clientId: string, event: EwebSocketEvent, data: any): void {
    webSocket.to(clientId).emit(event, data);
  }
}
