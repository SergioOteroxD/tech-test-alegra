import { QueryRecipesUC } from '../../src/core/use_case/query-recipes.uc';
import { RecipeRepository } from '../../src/drivers/repositories/recipe.repository.impl';
import { ResponseBase } from '../../src/common/types/response-base.model';
import { CustomError } from '../../src/common/types/custom-error';

// Create mock implementation
const mockGetById = jest.fn();
const mockGetTotal = jest.fn();
const mockGetAll = jest.fn();

const mockRecipeRepository = {
  getById: mockGetById,
  getTotal: mockGetTotal,
  getAll: mockGetAll,
};

// Mock the entire RecipeRepository class
RecipeRepository.getInstance = jest.fn().mockReturnValue(mockRecipeRepository);

describe('QueryRecipesUC', () => {
  let queryRecipesUC: QueryRecipesUC;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a new instance for each test
    queryRecipesUC = QueryRecipesUC.getInstance();
  });

  describe('getOne', () => {
    it('should return recipe when found', async () => {
      const mockRecipe = {
        id: 1,
        name: 'Test Recipe',
        createdAt: new Date(),
        updatedAt: new Date(),
        orders: [],
        recipeIngredients: [],
      };

      mockGetById.mockResolvedValue(mockRecipe);

      const result = await queryRecipesUC.getOne(1);

      expect(result).toBeInstanceOf(ResponseBase);
      expect(result.code).toBe('OK');
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockRecipe);
    });

    it('should return NOT_FOUND when recipe does not exist', async () => {
      mockGetById.mockResolvedValue(null);

      const result = await queryRecipesUC.getOne(1);

      expect(result).toBeInstanceOf(ResponseBase);
      expect(result.code).toBe('NOT_FOUND');
      expect(result.status).toBe(404);
    });

    it('should handle errors properly', async () => {
      mockGetById.mockRejectedValue(new Error('Database error'));

      const result = await queryRecipesUC.getOne(1);

      expect(result).toBeInstanceOf(CustomError);
      expect(result.status).toBe(500);
    });
  });

  describe('getAll', () => {
    it('should return recipes list when found', async () => {
      const mockRecipes = [
        {
          id: 1,
          name: 'Recipe 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          orders: [],
          recipeIngredients: [],
        },
        {
          id: 2,
          name: 'Recipe 2',
          createdAt: new Date(),
          updatedAt: new Date(),
          orders: [],
          recipeIngredients: [],
        },
      ];

      mockGetTotal.mockResolvedValue(2);
      mockGetAll.mockResolvedValue(mockRecipes);

      const result = await queryRecipesUC.getAll(1, 10);

      expect(result.code).toBe('OK');
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockRecipes);
    });

    it('should return NOT_FOUND when no recipes exist', async () => {
      mockGetTotal.mockResolvedValue(0);

      const result = await queryRecipesUC.getAll(1, 10);

      expect(result.code).toBe('NOT_FOUND');
      expect(result.status).toBe(404);
    });
  });
});
