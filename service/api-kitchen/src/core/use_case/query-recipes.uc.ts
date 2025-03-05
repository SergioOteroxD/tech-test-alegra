import { CustomError } from '../../common/types/custom-error';
import { IresponseBase, ResponseBase, ResponseQuery } from '../../common/types/response-base.model';
import { RecipeRepository } from '../../drivers/repositories/recipe.repository.impl';

export class QueryRecipesUC {
  private static instance: QueryRecipesUC;

  private recipesDriver: RecipeRepository;

  constructor() {
    this.recipesDriver = RecipeRepository.getInstance();
  }

  public static getInstance(): QueryRecipesUC {
    if (!QueryRecipesUC.instance) {
      QueryRecipesUC.instance = new QueryRecipesUC();
    }
    return QueryRecipesUC.instance;
  }

  async getAll(page: number, limit: number): Promise<IresponseBase> {
    // Buscar al usuario por el correo electrónico
    try {
      const filter = {};

      const total: number = await this.recipesDriver.getTotal(filter);

      if (total == 0)
        return new ResponseBase({
          code: 'NOT_FOUND',
          message: 'No se encontró información.',
          status: 404,
        });

      const data = await this.recipesDriver.getAll(
        page,
        limit,
        filter,
        { recipeIngredients: { ingredient: true } },
        {
          id: true,
          name: true,
          recipeIngredients: {
            ingredient: { name: true, id: true },
            ingredientId: true,
            quantity: true,
            recipeId: true,
          },
          createdAt: true,
          updatedAt: true,
        },
        { createdAt: 'DESC' },
      );

      return new ResponseQuery(
        { code: 'OK', message: 'Datos consultados correctamente.', status: 200 },
        data,
        page,
        limit,
        total,
      );
    } catch (error) {
      console.log('🚀 ~ QueryOrderUC ~ requestOrder ~ error:', error);
      return new CustomError({ message: 'Error', code: 500 }, 'QueryOrderUC.requestOrder', 'Business');
    }
  }

  async getOne(orderId: number): Promise<IresponseBase> {
    // Buscar al usuario por el correo electrónico
    try {
      const data = await this.recipesDriver.getById(orderId);
      if (!data)
        return new ResponseBase({
          code: 'NOT_FOUND',
          message: 'No se encontró información.',
          status: 404,
        });

      return new ResponseBase({ code: 'OK', message: 'Datos consultados correctamente.', status: 200 }, data);
    } catch (error) {
      console.log('🚀 ~ QueryOrderUC ~ requestOrder ~ error:', error);
      return new CustomError({ message: 'Error', code: 500 }, 'QueryOrderUC.requestOrder', 'Business');
    }
  }
}
