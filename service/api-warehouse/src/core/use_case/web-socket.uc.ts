import { WebSocketDriver } from '../../drivers/repositories/web-socket.driver.impl';

export class WebSocketUC {
  private static instance: WebSocketUC;

  private wsDriver: WebSocketDriver;
  constructor() {
    this.wsDriver = WebSocketDriver.getInstance();
  }

  // Método para obtener la instancia única
  public static getInstance(): WebSocketUC {
    if (!WebSocketUC.instance) {
      WebSocketUC.instance = new WebSocketUC();
    }
    return WebSocketUC.instance;
  }

  async on(ev: string, callback: (...args: any[]) => void): Promise<any> {
    return this.wsDriver.on(ev, callback);
  }
}
