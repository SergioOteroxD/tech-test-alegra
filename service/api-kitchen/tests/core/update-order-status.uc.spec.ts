import { UpdateOrderStatusUC } from '../../src/core/use_case/update-order-status.uc';
import { OrderRepository } from '../../src/drivers/repositories/order.repository.impl';
import { WebSocketDriver } from '../../src/drivers/repositories/web-socket.driver.impl';
import { ResponseBase } from '../../src/common/types/response-base.model';
import { EstatusOrder } from '../../src/common/enum/status-order.enum';

const mockGetById = jest.fn();
const mockUpdate = jest.fn();
const mockWsBroadcast = jest.fn();

const mockOrderRepository = {
  getById: mockGetById,
  update: mockUpdate,
};

const mockWebSocketRepository = { broadcast: mockWsBroadcast, on: jest.fn(), sendToClient: jest.fn() };

OrderRepository.getInstance = jest.fn().mockReturnValue(mockOrderRepository);
WebSocketDriver.getInstance = jest.fn().mockReturnValue(mockWebSocketRepository);

describe('UpdateOrderStatusUC', () => {
  let updateOrderStatusUC: UpdateOrderStatusUC;

  beforeEach(() => {
    jest.clearAllMocks();
    updateOrderStatusUC = UpdateOrderStatusUC.getInstance();
  });

  describe('update', () => {
    it('should update order status from PENDING to PREPARING', async () => {
      const mockOrder = {
        id: 1,
        status: EstatusOrder.PENDING,
      };

      mockGetById.mockResolvedValue(mockOrder);
      mockUpdate.mockResolvedValue({ ...mockOrder, status: EstatusOrder.PREPARING });

      const result = await updateOrderStatusUC.update(1, {
        status: EstatusOrder.PREPARING,
      });

      expect(result).toBeInstanceOf(ResponseBase);
      expect(result.code).toBe('UPD_ORDER_OK');
      expect(result.status).toBe(200);
      expect(mockWsBroadcast).toHaveBeenCalled();
    });

    it('should return NOT_FOUND when order does not exist', async () => {
      mockGetById.mockResolvedValue(null);

      const result = await updateOrderStatusUC.update(1, {
        status: EstatusOrder.PREPARING,
      });

      expect(result).toBeInstanceOf(ResponseBase);
      expect(result.code).toBe('UPD_ORDER_NOT_FOUND');
      expect(result.status).toBe(404);
    });

    it('should return error for invalid status transition', async () => {
      const mockOrder = {
        id: 1,
        status: EstatusOrder.PENDING,
      };

      mockGetById.mockResolvedValue(mockOrder);

      const result = await updateOrderStatusUC.update(1, {
        status: EstatusOrder.COMPLETED,
      });

      expect(result).toBeInstanceOf(ResponseBase);
      expect(result.code).toBe('UPD_ORDER_INVALID_STATUS');
      expect(result.status).toBe(400);
    });
  });
});
