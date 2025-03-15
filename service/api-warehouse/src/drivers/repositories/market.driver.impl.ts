import axios, { AxiosInstance } from 'axios';
import { apisConfig } from '../../common/config';
import { CustomError } from '../../common/types/custom-error';
import { PurchaseRepository } from './purchase.repository.impl';
import { ImissingIngredients } from '../../core/model/operation/event-buy-ingredients-data.model';

export class MarketDriver {
  private static instance: MarketDriver;
  private client: AxiosInstance;
  private purchaseDriver: PurchaseRepository;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 5000, // Tiempo de espera en ms
      headers: { 'Content-Type': 'application/json' },
    });
    this.purchaseDriver = PurchaseRepository.getInstance();
  }

  // Método para obtener la instancia única
  public static getInstance(): MarketDriver {
    if (!MarketDriver.instance) {
      MarketDriver.instance = new MarketDriver(apisConfig.buyIngredients);
    }
    return MarketDriver.instance;
  }

  async buyIngredient<T>(ingredient: ImissingIngredients, totalBought = 0): Promise<number> {
    try {
      const response = await this.client.get<{
        quantitySold: number;
      }>('/farmers-market/buy', {
        params: { ingredient: ingredient.name },
      });

      const boughtNow = response.data.quantitySold;
      totalBought += boughtNow;

      if (boughtNow > 0) {
        await this.purchaseDriver.create({
          ingredientId: ingredient.ingredientId,
          quantity: boughtNow,
        });
      }

      const rest = ingredient.missingQuantity - response.data.quantitySold;

      if (rest > 0) {
        return await this.buyIngredient(
          {
            ingredientId: ingredient.ingredientId,
            name: ingredient.name,
            missingQuantity: rest,
          },
          totalBought,
        );
      }

      return totalBought;
    } catch (error) {
      throw new CustomError({ message: 'Error', code: 500 }, 'QueryOrderUC.requestOrder', 'Business');
    }
  }
}
