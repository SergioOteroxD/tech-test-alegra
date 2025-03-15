import { RequestOrderUC } from '../../src/core/use_case/request-order.uc';
import { ResponseBase } from '../../src/common/types/response-base.model';
import { EwarehouseTask } from '../../src/common/enum/warehouse-queue.enum';
import { EstatusOrder } from '../../src/common/enum/status-order.enum';
import { OrderRepository } from '../../src/drivers/repositories/order.repository.impl';
import { RecipeRepository } from '../../src/drivers/repositories/recipe.repository.impl';
import { CacheDriver } from '../../src/drivers/repositories/cache-manager.driver.impl';
import { TaskQueueDriver } from '../../src/drivers/repositories/task-queue.driver.impl';
import { WebSocketDriver } from '../../src/drivers/repositories/web-socket.driver.impl';

const mockOrderCreate = jest.fn();
const mockRecipeFindAll = jest.fn();
const mockCacheGet = jest.fn();
const mockCacheSet = jest.fn();
const mockTaskAdd = jest.fn();
const mockWsBroadcast = jest.fn();

OrderRepository.getInstance = jest.fn().mockReturnValue({ create: mockOrderCreate });
RecipeRepository.getInstance = jest.fn().mockReturnValue({ findAll: mockRecipeFindAll });
CacheDriver.getInstance = jest.fn().mockReturnValue({
  get: mockCacheGet,
  set: mockCacheSet,
});
TaskQueueDriver.getInstance = jest.fn().mockReturnValue({
  add: mockTaskAdd,
});

WebSocketDriver.getInstance = jest.fn().mockReturnValue({ broadcast: mockWsBroadcast });

describe('RequestOrderUC', () => {
  let requestOrderUC: RequestOrderUC;

  beforeEach(() => {
    jest.clearAllMocks();
    requestOrderUC = RequestOrderUC.getInstance();
  });

  describe('requestOrder', () => {
    it('should create order successfully', async () => {
      const mockRecipe = {
        id: 1,
        name: 'Test Recipe',
      };

      const mockOrder = {
        id: 1,
        recipeId: mockRecipe.id,
        status: EstatusOrder.PENDING,
        createdAt: new Date(),
      };

      mockCacheGet.mockResolvedValue(null);
      mockRecipeFindAll.mockResolvedValue([mockRecipe]);
      mockOrderCreate.mockResolvedValue(mockOrder);
      mockTaskAdd.mockResolvedValue(undefined);

      const result = await requestOrderUC.requestOrder();

      expect(result).toBeInstanceOf(ResponseBase);
      expect(result.code).toBe('REQ_ORDER_OK');
      expect(result.status).toBe(201);
      expect(mockTaskAdd).toHaveBeenCalledWith(EwarehouseTask.BUY_INGREDIENT, expect.any(Object));
      expect(mockWsBroadcast).toHaveBeenCalled();
    });
  });
});
