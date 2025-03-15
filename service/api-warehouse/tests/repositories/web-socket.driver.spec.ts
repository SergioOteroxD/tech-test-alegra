import { WebSocketDriver } from '../../src/drivers/repositories/web-socket.driver.impl';
import { Server } from 'socket.io';
import { EwebSocketEvent } from '../../src/common/enum/web-socket.event';

describe('WebSocketDriver', () => {
  let webSocketDriver: WebSocketDriver;
  let mockServer: jest.Mocked<Server>;

  beforeEach(() => {
    // Reset singleton instance
    (WebSocketDriver as any).instance = null;

    mockServer = {
      on: jest.fn(),
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<Server>;

    webSocketDriver = WebSocketDriver.getInstance(mockServer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('on', () => {
    it('should register event listener', () => {
      const eventName = 'test-event';
      const callback = jest.fn();

      webSocketDriver.on(eventName, callback);

      expect(mockServer.on).toHaveBeenCalledWith(eventName, callback);
    });
  });

  describe('broadcast', () => {
    it('should emit event to all clients', () => {
      const event = EwebSocketEvent.INVENTORY_UPDATE;
      const data = { orderId: 1, status: 'pending' };

      webSocketDriver.broadcast(event, data);

      expect(mockServer.emit).toHaveBeenCalledWith(event, data);
    });
  });

  describe('sendToClient', () => {
    it('should emit event to specific client', () => {
      const clientId = 'client-123';
      const event = EwebSocketEvent.INVENTORY_UPDATE;
      const data = { orderId: 1, status: 'pending' };

      webSocketDriver.sendToClient(clientId, event, data);

      expect(mockServer.to).toHaveBeenCalledWith(clientId);
      expect(mockServer.emit).toHaveBeenCalledWith(event, data);
    });
  });

  describe('getInstance', () => {
    it('should return the same instance with same socket server', () => {
      const instance1 = WebSocketDriver.getInstance(mockServer);
      const instance2 = WebSocketDriver.getInstance(mockServer);

      expect(instance1).toBe(instance2);
    });

    it('should maintain existing instance when called without server', () => {
      const instance1 = WebSocketDriver.getInstance(mockServer);
      const instance2 = WebSocketDriver.getInstance();

      expect(instance1).toBe(instance2);
    });
  });
});
