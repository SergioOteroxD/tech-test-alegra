import { QueryPurchasesUC } from '../../src/core/use_case/query-purchases.uc';
import { PurchaseRepository } from '../../src/drivers/repositories/purchase.repository.impl';
import { CustomError } from '../../src/common/types/custom-error';

jest.mock('../../src/drivers/repositories/purchase.repository.impl');

describe('QueryPurchasesUC', () => {
  let queryPurchasesUC: QueryPurchasesUC;
  let mockPurchaseRepository: jest.Mocked<PurchaseRepository>;

  beforeEach(() => {
    (QueryPurchasesUC as any).instance = null;
    mockPurchaseRepository = {
      getInstance: jest.fn(),
      getTotal: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
    } as any;

    PurchaseRepository.getInstance = jest.fn().mockReturnValue(mockPurchaseRepository);
    queryPurchasesUC = QueryPurchasesUC.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return purchases successfully', async () => {
      const mockData = [
        {
          id: 1,
          ingredientId: 1,
          quantity: 5,
          ingredient: {
            id: 1,
            name: 'Tomato',
            inventory: {
              id: 1,
              ingredientId: 1,
              quantity: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            purchases: [],
            recipeIngredients: [],
          },
          purchasedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPurchaseRepository.getTotal.mockResolvedValue(1);
      mockPurchaseRepository.getAll.mockResolvedValue(mockData);

      const result = await queryPurchasesUC.getAll(1, 10, { ingredientId: undefined });

      expect(result.status).toBe(200);
      expect(result.code).toBe('OK');
    });

    it('should return not found when no purchases exist', async () => {
      mockPurchaseRepository.getTotal.mockResolvedValue(0);

      const result = await queryPurchasesUC.getAll(1, 10, { ingredientId: undefined });

      expect(result.status).toBe(404);
      expect(result.code).toBe('NOT_FOUND');
    });

    it('should handle filter by ingredientId', async () => {
      mockPurchaseRepository.getTotal.mockResolvedValue(1);
      mockPurchaseRepository.getAll.mockResolvedValue([]);

      await queryPurchasesUC.getAll(1, 10, { ingredientId: 1 });

      expect(mockPurchaseRepository.getTotal).toHaveBeenCalledWith({ ingredientId: 1 });
    });

    it('should handle errors', async () => {
      mockPurchaseRepository.getTotal.mockRejectedValue(new Error('Database error'));

      const result = await queryPurchasesUC.getAll(1, 10, { ingredientId: undefined });

      expect(result).toBeInstanceOf(CustomError);
      expect(result.status).toBe(500);
    });
  });

  describe('getOne', () => {
    it('should return purchase by id successfully', async () => {
      const mockData = {
        id: 1,
        ingredientId: 1,
        quantity: 5,
        ingredient: {
          id: 1,
          name: 'Tomato',
          inventory: {
            id: 1,
            ingredientId: 1,
            quantity: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          purchases: [],
          recipeIngredients: [],
        },
        purchasedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPurchaseRepository.getById.mockResolvedValue(mockData);

      const result = await queryPurchasesUC.getOne(1);

      expect(result.status).toBe(200);
      expect(result.code).toBe('OK');
      expect(result.data).toEqual(mockData);
    });

    it('should return not found when purchase does not exist', async () => {
      mockPurchaseRepository.getById.mockResolvedValue(null);

      const result = await queryPurchasesUC.getOne(1);

      expect(result.status).toBe(404);
      expect(result.code).toBe('NOT_FOUND');
    });

    it('should handle errors', async () => {
      mockPurchaseRepository.getById.mockRejectedValue(new Error('Database error'));

      const result = await queryPurchasesUC.getOne(1);

      expect(result).toBeInstanceOf(CustomError);
      expect(result.status).toBe(500);
    });
  });
});
