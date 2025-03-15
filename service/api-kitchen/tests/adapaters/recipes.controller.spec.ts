import request from 'supertest';
import express, { Express } from 'express';
import { RecipesController } from '../../src/adapters/api/recipes.controller';
import { QueryRecipesUC } from '../../src/core/use_case/query-recipes.uc';

QueryRecipesUC.getInstance = jest.fn().mockReturnValue({
  getAll: jest.fn(),
  getOne: jest.fn(),
});

describe('RecipesController', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Initialize controller
    const recipesController = new RecipesController();

    // Setup routes
    app.get('/recipes', recipesController.getAll.bind(recipesController));
    app.get('/recipes/:recipeId', recipesController.getOne.bind(recipesController));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /recipes', () => {
    it('should return all recipes', async () => {
      const mockRecipes = {
        code: 'OK',
        status: 200,
        message: 'Datos consultados correctamente.',
        data: [
          {
            id: 1,
            name: 'Recipe 1',
            recipeIngredients: [],
            orders: [],
          },
          {
            id: 2,
            name: 'Recipe 2',
            recipeIngredients: [],
            orders: [],
          },
        ],
      };

      QueryRecipesUC.getInstance().getAll = jest.fn().mockResolvedValue(mockRecipes);

      const response = await request(app).get('/recipes').query({ page: 1, limit: 10 }).expect(200);

      expect(response.body.code).toBe('OK');
      expect(response.body.data).toHaveLength(2);
    });

    it('should return 404 when no recipes found', async () => {
      const mockResponse = {
        code: 'NOT_FOUND',
        status: 404,
        message: 'No se encontró información.',
      };

      QueryRecipesUC.getInstance().getAll = jest.fn().mockResolvedValue(mockResponse);

      const response = await request(app).get('/recipes').query({ page: 1, limit: 10 }).expect(404);

      expect(response.body.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /recipes/:recipeId', () => {
    it('should return a specific recipe', async () => {
      const mockRecipe = {
        code: 'OK',
        status: 200,
        message: 'Datos consultados correctamente.',
        data: {
          id: 1,
          name: 'Recipe 1',
          recipeIngredients: [],
          orders: [],
        },
      };

      QueryRecipesUC.getInstance().getOne = jest.fn().mockResolvedValue(mockRecipe);

      const response = await request(app).get('/recipes/1').expect(200);

      expect(response.body.code).toBe('OK');
      expect(response.body.data.id).toBe(1);
    });

    it('should return 404 when recipe not found', async () => {
      const mockResponse = {
        code: 'NOT_FOUND',
        status: 404,
        message: 'No se encontró información.',
      };

      QueryRecipesUC.getInstance().getOne = jest.fn().mockResolvedValue(mockResponse);

      const response = await request(app).get('/recipes/999').expect(404);

      expect(response.body.code).toBe('NOT_FOUND');
    });
  });
});
