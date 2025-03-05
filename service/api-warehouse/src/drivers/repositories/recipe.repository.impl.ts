import { FindOptionsOrder, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { AppDataSource } from '../database/postgres.connect';
import { CustomError } from '../../common/types/custom-error';
import { Recipes } from '../entities/recipes.entity';

export class RecipeRepository {
  private static instance: RecipeRepository;
  private repository: Repository<Recipes>;

  constructor() {
    this.repository = AppDataSource.getRepository(Recipes);
  }

  // Método para obtener la instancia única
  public static getInstance(): RecipeRepository {
    if (!RecipeRepository.instance) {
      RecipeRepository.instance = new RecipeRepository();
    }
    return RecipeRepository.instance;
  }

  async create(orders: Omit<Recipes, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipes> {
    try {
      const newRecipes = this.repository.create(orders);
      return await this.repository.save(newRecipes);
    } catch (error) {
      throw new CustomError({ message: 'ERROR', code: 500 }, 'IRecipesRepository.create', 'Business');
    }
  }

  async getById(id: number): Promise<Recipes | null> {
    return await this.repository.findOneBy({ id });
  }

  async getAll(
    page: number,
    limit: number,
    filter: FindOptionsWhere<Recipes>,
    projection?: FindOptionsSelect<Recipes>,
    sort?: FindOptionsOrder<Recipes>,
  ): Promise<Recipes[]> {
    return await this.repository.find({
      where: filter,
      take: limit,
      skip: page * limit,
      select: projection,
      order: sort,
    });
  }

  async findAll(
    filter: FindOptionsWhere<Recipes>,
    projection?: FindOptionsSelect<Recipes>,
    relations?: FindOptionsRelations<Recipes>,
    sort?: FindOptionsOrder<Recipes>,
  ): Promise<Recipes[]> {
    return await this.repository.find({ where: filter, select: projection, relations, order: sort });
  }

  async update(id: number, data: Partial<Recipes>): Promise<Recipes | null> {
    await this.repository.update(id, data);
    return await this.repository.findOneBy({ id });
  }
}
