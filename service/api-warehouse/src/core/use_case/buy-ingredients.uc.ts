import { CustomError } from '../../common/types/custom-error';
import { IresponseBase } from '../../common/types/response-base.model';
import { ImissingIngredients } from '../model/operation/event-buy-ingredients-data.model';
import { MarketDriver } from '../../drivers/repositories/market.driver.impl';
import { InventoryRepository } from '../../drivers/repositories/inventory.repository.impl';

export class BuyIngredientsUC {
  private static instance: BuyIngredientsUC;
  private marketDriver: MarketDriver;
  private inventoryDriver: InventoryRepository;

  constructor() {
    this.marketDriver = MarketDriver.getInstance();
    this.inventoryDriver = InventoryRepository.getInstance();
  }

  public static getInstance(): BuyIngredientsUC {
    if (!BuyIngredientsUC.instance) {
      BuyIngredientsUC.instance = new BuyIngredientsUC();
    }
    return BuyIngredientsUC.instance;
  }

  async buyIngredients(data: ImissingIngredients[]): Promise<IresponseBase> {
    // Buscar al usuario por el correo electrónico
    try {
      for (const ingredients of data) {
        const result = await this.marketDriver.buyIngredient(ingredients);
        const ingredient = await this.inventoryDriver.getById(ingredients.ingredientId);
        console.log('🚀 ~ BuyIngredientsUC ~ buyIngredients ~ ingredients:', {
          ingredientId: ingredients.ingredientId,
          result,
        });
        const updata = await this.inventoryDriver.updatePlusInventory(ingredients.ingredientId, result);
      }
    } catch (error) {
      console.log('🚀 ~ EventBuyIngredientsUC ~ buyIngredients ~ error:', error);
      return new CustomError({ message: 'Error', code: 500 }, 'EventBuyIngredientsUC.buyIngredients', 'Business');
    }
  }
}
