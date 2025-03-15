import { Server } from 'socket.io';
import { EwebSocketEvent } from '../../common/enum/web-socket.event';

export class WebSocketDriver {
  private static instance: WebSocketDriver;

  private webSocket: Server;

  constructor(webSocket?: Server) {
    this.webSocket = webSocket;
  }

  // Método para obtener la instancia única
  public static getInstance(webSocket?: Server): WebSocketDriver {
    if (!WebSocketDriver.instance) {
      WebSocketDriver.instance = new WebSocketDriver(webSocket);
    }
    return WebSocketDriver.instance;
  }

  on(ev: string, callback: (...args: any[]) => void): void {
    this.webSocket.on(ev, callback);
  }

  broadcast(event: EwebSocketEvent, data: any): void {
    this.webSocket.emit(event, data);
  }

  sendToClient(clientId: string, event: EwebSocketEvent, data: any): void {
    this.webSocket.to(clientId).emit(event, data);
  }
}
