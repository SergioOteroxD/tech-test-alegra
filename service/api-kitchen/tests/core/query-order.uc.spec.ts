import { QueryOrderUC } from '../../src/core/use_case/query-order.uc';
import { EstatusOrder } from '../../src/common/enum/status-order.enum';
import { ResponseBase, ResponseQuery } from '../../src/common/types/response-base.model';
import { OrderRepository } from '../../src/drivers/repositories/order.repository.impl';

// Create mock implementation
const mockGetById = jest.fn();
const mockGetTotal = jest.fn();
const mockGetAll = jest.fn();

const mockOrderRepository = {
  getById: mockGetById,
  getTotal: mockGetTotal,
  getAll: mockGetAll,
};

OrderRepository.getInstance = jest.fn().mockReturnValue(mockOrderRepository);

describe('QueryOrderUC', () => {
  let queryOrderUC: QueryOrderUC;

  beforeEach(() => {
    jest.clearAllMocks();
    queryOrderUC = QueryOrderUC.getInstance();
  });

  describe('getOne', () => {
    it('should return order when found', async () => {
      const mockOrder = {
        id: 1,
        status: EstatusOrder.PENDING,
        recipeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockGetById.mockResolvedValue(mockOrder);

      const result = await queryOrderUC.getOne(1);

      expect(result).toBeInstanceOf(ResponseBase);
      expect(result.code).toBe('OK');
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockOrder);
    });

    it('should return NOT_FOUND when order does not exist', async () => {
      mockGetById.mockResolvedValue(null);

      const result = await queryOrderUC.getOne(1);

      expect(result).toBeInstanceOf(ResponseBase);
      expect(result.code).toBe('NOT_FOUND');
      expect(result.status).toBe(404);
    });
  });

  describe('getAll', () => {
    it('should return orders list when found', async () => {
      const mockOrders = [
        {
          id: 1,
          status: EstatusOrder.PENDING,
          recipeId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockGetTotal.mockResolvedValue(1);
      mockGetAll.mockResolvedValue(mockOrders);

      const result = await queryOrderUC.getAll(1, 10, {
        status: [EstatusOrder.PENDING],
        recipeId: 1,
      });

      expect(result).toBeInstanceOf(ResponseQuery);
      expect(result.code).toBe('OK');
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockOrders);
    });

    it('should return NOT_FOUND when no orders exist', async () => {
      mockGetTotal.mockResolvedValue(0);

      const result = await queryOrderUC.getAll(1, 10, {
        status: [],
        recipeId: null,
      });

      expect(result).toBeInstanceOf(ResponseBase);
      expect(result.code).toBe('NOT_FOUND');
      expect(result.status).toBe(404);
    });
  });
});
