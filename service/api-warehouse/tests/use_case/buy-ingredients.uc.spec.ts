import { BuyIngredientsUC } from '../../src/core/use_case/buy-ingredients.uc';
import { MarketDriver } from '../../src/drivers/repositories/market.driver.impl';
import { InventoryRepository } from '../../src/drivers/repositories/inventory.repository.impl';
import { CustomError } from '../../src/common/types/custom-error';

jest.mock('../../src/drivers/repositories/market.driver.impl');
jest.mock('../../src/drivers/repositories/inventory.repository.impl');

describe('BuyIngredientsUC', () => {
  let buyIngredientsUC: BuyIngredientsUC;
  let mockMarketDriver: jest.Mocked<MarketDriver>;
  let mockInventoryRepository: jest.Mocked<InventoryRepository>;

  beforeEach(() => {
    (BuyIngredientsUC as any).instance = null;

    mockMarketDriver = {
      getInstance: jest.fn(),
      buyIngredient: jest.fn(),
    } as any;

    mockInventoryRepository = {
      getInstance: jest.fn(),
      getById: jest.fn(),
      updatePlusInventory: jest.fn(),
    } as any;

    MarketDriver.getInstance = jest.fn().mockReturnValue(mockMarketDriver);
    InventoryRepository.getInstance = jest.fn().mockReturnValue(mockInventoryRepository);

    buyIngredientsUC = BuyIngredientsUC.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('buyIngredients', () => {
    it('should buy ingredients successfully', async () => {
      const mockIngredients = [
        { ingredientId: 1, quantity: 5, name: 'Ingredient 1', missingQuantity: 4 },
        { ingredientId: 2, quantity: 3, name: 'Ingredient 1', missingQuantity: 3 },
      ];

      mockMarketDriver.buyIngredient.mockResolvedValueOnce(5).mockResolvedValueOnce(3);
      mockInventoryRepository.getById.mockResolvedValue({
        id: 1,
        ingredientId: 1,
        quantity: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockInventoryRepository.updatePlusInventory.mockResolvedValue(undefined);

      const result = await buyIngredientsUC.buyIngredients(mockIngredients);

      expect(mockMarketDriver.buyIngredient).toHaveBeenCalledTimes(2);
      expect(mockInventoryRepository.updatePlusInventory).toHaveBeenCalledTimes(2);
      expect(result).toBeUndefined();
    });

    it('should handle zero quantity purchases', async () => {
      const mockIngredients = [{ ingredientId: 1, quantity: 5, name: 'Ingredient 1', missingQuantity: 4 }];

      mockMarketDriver.buyIngredient.mockResolvedValue(0);
      mockInventoryRepository.getById.mockResolvedValue({
        id: 1,
        ingredientId: 1,
        quantity: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockInventoryRepository.updatePlusInventory.mockResolvedValue(undefined);

      const result = await buyIngredientsUC.buyIngredients(mockIngredients);

      expect(mockMarketDriver.buyIngredient).toHaveBeenCalledTimes(1);
      expect(mockInventoryRepository.updatePlusInventory).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should handle market service errors', async () => {
      const mockIngredients = [{ ingredientId: 1, quantity: 5, name: 'Ingredient 1', missingQuantity: 4 }];

      mockMarketDriver.buyIngredient.mockRejectedValue(new Error('Market service error'));

      const result = await buyIngredientsUC.buyIngredients(mockIngredients);

      expect(result).toBeInstanceOf(CustomError);
      expect(result.status).toBe(500);
    });

    it('should handle inventory service errors', async () => {
      const mockIngredients = [{ ingredientId: 1, quantity: 5, name: 'Ingredient 1', missingQuantity: 4 }];

      mockMarketDriver.buyIngredient.mockResolvedValue(5);
      mockInventoryRepository.getById.mockRejectedValue(new Error('Inventory service error'));

      const result = await buyIngredientsUC.buyIngredients(mockIngredients);

      expect(result).toBeInstanceOf(CustomError);
      expect(result.status).toBe(500);
    });
  });
});
