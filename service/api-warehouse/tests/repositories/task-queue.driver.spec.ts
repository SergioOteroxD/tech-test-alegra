import { TaskQueueDriver } from '../../src/drivers/repositories/task-queue.driver.impl';
import { buyIngredientQueue, sendIngredientQueue } from '../../src/drivers/database/redis.connect';
import { EwarehouseTask } from '../../src/common/enum/warehouse-queue.enum';
import { Queue } from 'bullmq';

jest.mock('../../src/drivers/database/redis.connect', () => ({
  buyIngredientQueue: {
    add: jest.fn(),
  },
  sendIngredientQueue: {
    add: jest.fn(),
  },
}));

describe('TaskQueueDriver', () => {
  let taskQueueDriver: TaskQueueDriver;
  let mockBuyQueue: jest.Mocked<Queue>;
  let mockSendQueue: jest.Mocked<Queue>;

  beforeEach(() => {
    // Reset singleton instance
    (TaskQueueDriver as any).instance = null;

    mockBuyQueue = buyIngredientQueue as jest.Mocked<Queue>;
    mockSendQueue = sendIngredientQueue as jest.Mocked<Queue>;
    taskQueueDriver = TaskQueueDriver.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should add task to buy ingredient queue', async () => {
      const mockData = { ingredientId: 1, quantity: 5 };
      mockBuyQueue.add.mockResolvedValue({} as any);

      await taskQueueDriver.add(EwarehouseTask.BUY_INGREDIENT, mockData);

      expect(mockBuyQueue.add).toHaveBeenCalledWith(EwarehouseTask.BUY_INGREDIENT, mockData);
      expect(mockSendQueue.add).not.toHaveBeenCalled();
    });

    it('should add task to send ingredient queue', async () => {
      const mockData = { ingredientId: 1, quantity: 3 };
      mockSendQueue.add.mockResolvedValue({} as any);

      await taskQueueDriver.add(EwarehouseTask.SEND_INGREDIENT, mockData);

      expect(mockSendQueue.add).toHaveBeenCalledWith(EwarehouseTask.SEND_INGREDIENT, mockData);
      expect(mockBuyQueue.add).not.toHaveBeenCalled();
    });

    it('should handle invalid queue type', async () => {
      const mockData = { ingredientId: 1 };
      const invalidQueue = 'INVALID_QUEUE' as EwarehouseTask;

      const result = await taskQueueDriver.add(invalidQueue, mockData);

      expect(result).toBeUndefined();
      expect(mockBuyQueue.add).not.toHaveBeenCalled();
      expect(mockSendQueue.add).not.toHaveBeenCalled();
    });
  });

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = TaskQueueDriver.getInstance();
      const instance2 = TaskQueueDriver.getInstance();

      expect(instance1).toBe(instance2);
    });
  });
});