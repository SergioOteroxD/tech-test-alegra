import { OrderRepository } from '../../src/drivers/repositories/order.repository.impl';
import { AppDataSource } from '../../src/drivers/database/postgres.connect';
import { EstatusOrder } from '../../src/common/enum/status-order.enum';

jest.mock('../../src/drivers/database/postgres.connect', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('OrderRepository', () => {
  let orderRepository: OrderRepository;
  let mockRepository: any;

  beforeEach(() => {
    // Reset singleton instance
    (OrderRepository as any).instance = null;

    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
    orderRepository = OrderRepository.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('should return an order by id', async () => {
      const mockOrder = {
        id: 1,
        status: EstatusOrder.PENDING,
        recipeId: 1,
        recipe: { id: 1, name: 'Test Recipe' },
      };
      mockRepository.findOne.mockResolvedValue(mockOrder);

      const result = await orderRepository.getById(1);

      expect(result).toEqual(mockOrder);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: undefined,
        select: undefined,
      });
    });
  });

  describe('getAll', () => {
    it('should return paginated orders', async () => {
      const mockOrders = [
        {
          id: 1,
          status: EstatusOrder.PENDING,
          recipeId: 1,
          recipe: { id: 1, name: 'Recipe 1' },
        },
        {
          id: 2,
          status: EstatusOrder.PREPARING,
          recipeId: 2,
          recipe: { id: 2, name: 'Recipe 2' },
        },
      ];
      mockRepository.find.mockResolvedValue(mockOrders);

      const result = await orderRepository.getAll(1, 10, {});

      expect(result).toEqual(mockOrders);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {},
        take: 10,
        skip: 0,
        relations: undefined,
        select: undefined,
        order: undefined,
      });
    });

    it('should filter orders by status', async () => {
      const mockOrders = [
        {
          id: 1,
          status: EstatusOrder.PENDING,
          recipeId: 1,
          recipe: { id: 1, name: 'Recipe 1' },
        },
      ];
      mockRepository.find.mockResolvedValue(mockOrders);

      const result = await orderRepository.getAll(1, 10, { status: EstatusOrder.PENDING });

      expect(result).toEqual(mockOrders);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: EstatusOrder.PENDING },
        take: 10,
        skip: 0,
        relations: undefined,
        select: undefined,
        order: undefined,
      });
    });
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const mockOrderInput = {
        recipeId: 1,
        status: EstatusOrder.PENDING,
      };
      const mockOrderOutput = {
        id: 1,
        ...mockOrderInput,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(mockOrderInput);
      mockRepository.save.mockResolvedValue(mockOrderOutput);

      const result = await orderRepository.create(mockOrderInput);

      expect(result).toEqual(mockOrderOutput);
      expect(mockRepository.create).toHaveBeenCalledWith(mockOrderInput);
      expect(mockRepository.save).toHaveBeenCalledWith(mockOrderInput);
    });
  });

  describe('update', () => {
    it('should update an order status', async () => {
      const updateData = { status: EstatusOrder.PREPARING };
      const mockUpdateResult = { affected: 1 };

      mockRepository.update.mockResolvedValue(mockUpdateResult);

      const result = await orderRepository.update(1, updateData);

      expect(result).toEqual(mockUpdateResult);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('getTotal', () => {
    it('should return total count of orders', async () => {
      mockRepository.count.mockResolvedValue(5);

      const result = await orderRepository.getTotal({});

      expect(result).toBe(5);
      expect(mockRepository.count).toHaveBeenCalledWith({ where: {} });
    });

    it('should return filtered count of orders', async () => {
      mockRepository.count.mockResolvedValue(2);

      const result = await orderRepository.getTotal({ status: EstatusOrder.PENDING });

      expect(result).toBe(2);
      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { status: EstatusOrder.PENDING },
      });
    });
  });
});
