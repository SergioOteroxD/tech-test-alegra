import { RecipeRepository } from '../../src/drivers/repositories/recipe.repository.impl';
import { AppDataSource } from '../../src/drivers/database/postgres.connect';
import { Recipes } from '../../src/drivers/entities/recipes.entity';

jest.mock('../../src/drivers/database/postgres.connect', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('RecipeRepository', () => {
  let recipeRepository: RecipeRepository;
  let mockRepository: any;

  beforeEach(() => {
    (RecipeRepository as any).instance = null;

    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
    recipeRepository = RecipeRepository.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('should return a recipe by id', async () => {
      const mockRecipe = { id: 1, name: 'Test Recipe' };
      mockRepository.findOneBy.mockResolvedValue(mockRecipe);

      const result = await recipeRepository.getById(1);

      expect(result).toEqual(mockRecipe);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });
  describe('getAll', () => {
    it('should return paginated recipes', async () => {
      const mockRecipes = [
        { id: 1, name: 'Recipe 1' },
        { id: 2, name: 'Recipe 2' },
      ];
      mockRepository.find.mockResolvedValue(mockRecipes);

      const result = await recipeRepository.getAll(1, 10, {});

      expect(result).toEqual(mockRecipes);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {},
        take: 10,
        skip: 0,
        relations: undefined,
        select: undefined,
        order: undefined,
      });
    });
  });

  describe('create', () => {
    it('should create a new recipe', async () => {
      const mockRecipeInput = {
        name: 'New Recipe',
        orders: [],
        recipeIngredients: [],
      };
      const mockRecipeOutput = {
        id: 1,
        name: 'New Recipe',
        orders: [],
        recipeIngredients: [],
      };

      mockRepository.create.mockReturnValue(mockRecipeInput);
      mockRepository.save.mockResolvedValue(mockRecipeOutput);

      const result = await recipeRepository.create(mockRecipeInput);

      expect(result).toEqual(mockRecipeOutput);
      expect(mockRepository.create).toHaveBeenCalledWith(mockRecipeInput);
      expect(mockRepository.save).toHaveBeenCalledWith(mockRecipeInput);
    });
  });

  describe('update', () => {
    it('should update a recipe', async () => {
      const mockRecipe = {
        id: 1,
        name: 'Updated Recipe',
        orders: [],
        recipeIngredients: [],
      };
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue(mockRecipe);

      const result = await recipeRepository.update(1, { name: 'Updated Recipe' });

      expect(result).toEqual(mockRecipe);
      expect(mockRepository.update).toHaveBeenCalledWith(1, { name: 'Updated Recipe' });
    });
  });
});
