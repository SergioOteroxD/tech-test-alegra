import { FindOptionsOrder, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { AppDataSource } from '../database/postgres.connect';
import { Inventory } from '../entities/inventory.entity';

export class InventoryRepository {
  private static instance: InventoryRepository;
  private repository: Repository<Inventory>;

  constructor() {
    this.repository = AppDataSource.getRepository(Inventory);
  }

  // Método para obtener la instancia única
  public static getInstance(): InventoryRepository {
    if (!InventoryRepository.instance) {
      InventoryRepository.instance = new InventoryRepository();
    }
    return InventoryRepository.instance;
  }

  async getById(ingredientId: number): Promise<Inventory | null> {
    return await this.repository.findOneBy({ ingredientId });
  }

  async getAll(
    page: number,
    limit: number,
    filter: FindOptionsWhere<Inventory>,
    projection?: FindOptionsSelect<Inventory>,
    sort?: FindOptionsOrder<Inventory>,
  ): Promise<Inventory[]> {
    return await this.repository.find({
      where: filter,
      take: limit,
      skip: page * limit,
      select: projection,
      order: sort,
    });
  }

  async findAll(
    filter: FindOptionsWhere<Inventory> | FindOptionsWhere<Inventory>[],
    projection?: FindOptionsSelect<Inventory>,
    sort?: FindOptionsOrder<Inventory>,
  ): Promise<Inventory[]> {
    return await this.repository.find({ where: filter, select: projection, order: sort });
  }

  async update(ingredientId: number, data: Partial<Inventory>): Promise<Inventory | null> {
    await this.repository.update(ingredientId, data);
    return await this.repository.findOneBy({ ingredientId });
  }
}
