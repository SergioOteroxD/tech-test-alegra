import { CustomError } from '../../common/types/custom-error';
import { IresponseBase, ResponseBase } from '../../common/types/response-base.model';
import { RecipeRepository } from '../../drivers/repositories/recipe.repository.impl';
import { CacheDriver } from '../../drivers/repositories/cache-manager.dirver.impl';
import { Recipes } from '../../drivers/entities/recipes.entity';
import { InventoryRepository } from '../../drivers/repositories/inventory.repository.impl';
import { EstatusOrder } from '../../common/enum/status-order.enum';
import { EventDriver } from '../../drivers/repositories/event.driver.impl';
import { IreuqestIngredientData } from '../model/operation/request-ingredient-data.model';

export class RequestIngredientsUC {
  private static instance: RequestIngredientsUC;
  private recipeDriver: RecipeRepository;
  private inventoryDriver: InventoryRepository;
  private cacheDriver: CacheDriver;
  private eventDriver: EventDriver;

  constructor() {
    this.recipeDriver = RecipeRepository.getInstance();
    this.cacheDriver = CacheDriver.getInstance();
    this.inventoryDriver = InventoryRepository.getInstance();
    this.eventDriver = EventDriver.getInstance();
  }

  public static getInstance(): RequestIngredientsUC {
    if (!RequestIngredientsUC.instance) {
      RequestIngredientsUC.instance = new RequestIngredientsUC();
    }
    return RequestIngredientsUC.instance;
  }

  async requestOrder(dataBody: IreuqestIngredientData): Promise<IresponseBase> {
    // Buscar al usuario por el correo electrónico
    try {
      let recipes: Recipes[];
      recipes = await this.cacheDriver.get('data.recipes');
      // Si no hay recetas en caché, obtenerlas de la base de datos
      if (!recipes) {
        recipes = await this.recipeDriver.findAll(
          {},
          { id: true, name: true, recipeIngredients: true },
          { recipeIngredients: true },
        );
        await this.cacheDriver.set('data.recipes', recipes);
      }

      const recipe = recipes.find((item) => item.id === dataBody.recipeId);
      if (!recipe) {
        return new ResponseBase(
          {
            code: 'REQ_ING_NOT_FOUND',
            message: 'No se encontró la receta.',
            status: 404,
          },
          { recipeId: dataBody.recipeId },
        );
      }

      const inventory = await this.inventoryDriver.findAll(
        recipe.recipeIngredients.map((ingredient) => ({ ingredientId: ingredient.ingredientId })),
      );

      const { result, message, data } = this.heckIngredients(recipe.recipeIngredients, inventory);

      if (!result) {
        // Crear evento para comprar ingredientes
        for (const { ingredientId, missingQuantity } of data) {
          await this.eventDriver.publish(`buy-ingredients:${ingredientId}`, { ingredientId, missingQuantity });
        }
        return new ResponseBase(
          {
            code: 'REQ_ING_BUY_ING',
            message: message,
            status: 400,
          },
          data,
        );
      } else {
        // descontar ingredientes del inventario
        for (const { ingredientId, quantity } of recipe.recipeIngredients) {
          const actualQuantity = inventory.find((item) => item.ingredientId === ingredientId)?.quantity;
          if (actualQuantity) {
            await this.inventoryDriver.update(ingredientId, { quantity: actualQuantity - quantity });
          }
        }
      }

      return new ResponseBase(
        {
          code: 'REQ_ING_OK',
          message,
          status: 200,
        },
        { recipe: { recipeId: recipe.id, name: recipe.name } },
      );
    } catch (error) {
      console.log('🚀 ~ DiscountInventoryUC ~ requestOrder ~ error:', error);
      return new CustomError({ message: 'Error', code: 500 }, 'DiscountInventoryUC.requestOrder', 'Business');
    }
  }

  private heckIngredients(recipeIngredients: IrecipeIngredients[], inventory: IinventoryIngredients[]): Iresult {
    const inventoryMap = new Map<number, number>(inventory.map((item) => [item.ingredientId, item.quantity]));
    const missingIngredients: ImissingIngredients[] = [];

    // Verificar si hay suficientes ingredientes
    for (const { ingredientId, quantity } of recipeIngredients) {
      const available = inventoryMap.get(ingredientId) ?? 0;
      // Si no hay suficientes ingredientes, agregar a la lista de faltantes
      if (available < quantity) {
        missingIngredients.push({
          ingredientId,
          missingQuantity: quantity - available,
        });
      }
    }

    // Si no hay ingredientes faltantes, retornar mensaje de éxito
    if (missingIngredients.length === 0) {
      console.log('✅ Tienes suficientes ingredientes para la receta.');
      return { result: true, message: '✅ Tienes suficientes ingredientes para la receta.', data: [] };
    } else {
      console.log('❌ No tienes suficientes ingredientes. Debes comprar:');
      missingIngredients.forEach(({ ingredientId, missingQuantity }) => {
        console.log(`- Ingrediente ${ingredientId}: Faltan ${missingQuantity} unidades.`);
      });
      return {
        result: false,
        data: missingIngredients,
        message: missingIngredients
          .map(
            ({ ingredientId, missingQuantity }) => `Ingrediente ${ingredientId}: Faltan ${missingQuantity} unidades.`,
          )
          .join('\n'),
      };
    }
  }
}

interface IrecipeIngredients {
  recipeId: number;
  ingredientId: number;
  quantity: number;
}

interface IinventoryIngredients {
  ingredientId: number;
  quantity: number;
}

interface Iresult {
  result: boolean;
  message: string;
  data: ImissingIngredients[];
}

interface ImissingIngredients {
  ingredientId: number;
  missingQuantity: number;
}
