import { CustomError } from '../../common/types/custom-error';
import { IresponseBase, ResponseBase } from '../../common/types/response-base.model';
import { OrderRepository } from '../../drivers/repositories/order.repository.impl';
import { RecipeRepository } from '../../drivers/repositories/recipe.repository.impl';
import { CacheDriver } from '../../drivers/repositories/cache-manager.driver.impl';
import { Recipes } from '../../drivers/entities/recipes.entity';
import { WarehouseDriver } from '../../drivers/repositories/warehouse.driver.impl';
import { EstatusOrder } from '../../common/enum/status-order.enum';

export class RequestOrderUC {
  private static instance: RequestOrderUC;

  private orderDriver: OrderRepository;
  private warehouseDriver: WarehouseDriver;
  private recipeDriver: RecipeRepository;
  private cacheDriver: CacheDriver;

  constructor() {
    this.orderDriver = OrderRepository.getInstance();
    this.recipeDriver = RecipeRepository.getInstance();
    this.cacheDriver = CacheDriver.getInstance();
    this.warehouseDriver = WarehouseDriver.getInstance();
  }

  public static getInstance(): RequestOrderUC {
    if (!RequestOrderUC.instance) {
      RequestOrderUC.instance = new RequestOrderUC();
    }
    return RequestOrderUC.instance;
  }

  async requestOrder(): Promise<IresponseBase> {
    // Buscar al usuario por el correo electrónico
    try {
      const recipe = await this.getRandomReceipe();

      // !! request ingredients
      const result = await this.warehouseDriver.requestIngredients(recipe.id);

      const order = await this.orderDriver.create({
        recipeId: recipe.id,
        status: result.data.code == 'REQ_ING_OK' ? EstatusOrder.PREPARING : EstatusOrder.PENDING,
      });

      return new ResponseBase(
        {
          code: 'REQ_ORDER_OK',
          message: 'La orden se ha solicitado correctamente.',
          status: 200,
        },
        { orderId: order.id, recipe: { recipeId: recipe.id, name: recipe.name } },
      );
    } catch (error) {
      console.log('🚀 ~ RequestOrderUC ~ requestOrder ~ error:', error);
      return new CustomError({ message: 'Error', code: 500 }, 'RequestOrderUC.requestOrder', 'Business');
    }
  }

  private async getRandomReceipe(): Promise<Recipes> {
    let recipes: Recipes[];
    // Obtener recetas de la caché
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
    const randomIndex = Math.floor(Math.random() * recipes.length);
    return recipes[randomIndex];
  }
}
