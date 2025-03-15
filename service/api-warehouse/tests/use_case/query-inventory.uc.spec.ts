import { QueryInventoryUC } from '../../src/core/use_case/query-ingredients.uc';
import { InventoryRepository } from '../../src/drivers/repositories/inventory.repository.impl';
import { CustomError } from '../../src/common/types/custom-error';

const mockOrderRepository = {
  getById: jest.fn(),
  getTotal: jest.fn(),
  getAll: jest.fn(),
};
InventoryRepository.getInstance = jest.fn().mockReturnValue(mockOrderRepository);

describe('QueryInventoryUC', () => {
  let queryInventoryUC: QueryInventoryUC;
  let mockInventoryRepository: jest.Mocked<InventoryRepository>;

  beforeEach(() => {
    (QueryInventoryUC as any).instance = null;
    mockInventoryRepository = {
      getInstance: jest.fn(),
      getTotal: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
    } as any;

    InventoryRepository.getInstance = jest.fn().mockReturnValue(mockInventoryRepository);
    queryInventoryUC = QueryInventoryUC.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return inventory items successfully', async () => {
      const mockData = [
        {
          id: 1,
          ingredientId: 1,
          quantity: 10,
          ingredient: {
            id: 1,
            name: 'Tomato',
            inventory: {
              id: 1,
              ingredientId: 1,
              quantity: 10,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            purchases: [],
            recipeIngredients: [],
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockInventoryRepository.getTotal.mockResolvedValue(1);
      mockInventoryRepository.getAll.mockResolvedValue(mockData);

      const result = await queryInventoryUC.getAll(1, 10);

      expect(result.status).toBe(200);
      expect(result.code).toBe('OK');
    });

    it('should return not found when no inventory items exist', async () => {
      mockInventoryRepository.getTotal.mockResolvedValue(0);

      const result = await queryInventoryUC.getAll(1, 10);

      expect(result.status).toBe(404);
      expect(result.code).toBe('NOT_FOUND');
    });

    it('should handle errors', async () => {
      mockInventoryRepository.getTotal.mockRejectedValue(new Error('Database error'));

      const result = await queryInventoryUC.getAll(1, 10);

      expect(result).toBeInstanceOf(CustomError);
      expect(result.status).toBe(500);
    });
  });

  describe('getOne', () => {
    it('should return inventory item by id successfully', async () => {
      const mockData = {
        id: 1,
        ingredientId: 1,
        quantity: 10,
        ingredient: {
          id: 1,
          name: 'Tomato',
          inventory: {
            id: 1,
            ingredientId: 1,
            quantity: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          purchases: [],
          recipeIngredients: [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockInventoryRepository.getById.mockResolvedValue(mockData);

      const result = await queryInventoryUC.getOne(1);

      expect(result.status).toBe(200);
      expect(result.code).toBe('OK');
      expect(result.data).toEqual(mockData);
    });

    it('should return not found when inventory item does not exist', async () => {
      mockInventoryRepository.getById.mockResolvedValue(null);

      const result = await queryInventoryUC.getOne(1);

      expect(result.status).toBe(404);
      expect(result.code).toBe('NOT_FOUND');
    });

    it('should handle errors', async () => {
      mockInventoryRepository.getById.mockRejectedValue(new Error('Database error'));

      const result = await queryInventoryUC.getOne(1);

      expect(result).toBeInstanceOf(CustomError);
      expect(result.status).toBe(500);
    });
  });
});
