import { FindOptionsOrder, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { AppDataSource } from '../database/postgres.connect';
import { Inventory } from '../entities/inventory.entity';
import { WebSocketDriver } from './web-socket.driver.impl';
import { EwebSocketEvent } from '../../common/enum/web-socket.event';

export class InventoryRepository {
  private static instance: InventoryRepository;
  private repository: Repository<Inventory>;
  private ws: WebSocketDriver;

  constructor() {
    this.repository = AppDataSource.getRepository(Inventory);
    this.ws = WebSocketDriver.getInstance();
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

  async getTotal(filter: FindOptionsWhere<Inventory>): Promise<number> {
    return await this.repository.count({ where: filter });
  }

  async getAll(
    page: number,
    limit: number,
    filter: FindOptionsWhere<Inventory>,
    relations?: FindOptionsRelations<Inventory>,
    projection?: FindOptionsSelect<Inventory>,
    sort?: FindOptionsOrder<Inventory>,
  ): Promise<Inventory[]> {
    return await this.repository.find({
      where: filter,
      take: limit,
      skip: limit * (page - 1),
      relations,
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

  async updatePlusInventory(ingredientId: number, quantityBought: number) {
    await this.repository
      .createQueryBuilder()
      .update(Inventory)
      .set({ quantity: () => `quantity + ${quantityBought}` })
      .where('ingredient_id = :ingredientId', { ingredientId })
      .execute();
  }

  async updateMenosInventory(ingredientId: number, quantityBought: number) {
    await this.repository
      .createQueryBuilder()
      .update(Inventory)
      .set({ quantity: () => `quantity - ${quantityBought}` })
      .where('ingredient_id = :ingredientId', { ingredientId })
      .execute();
    const result = await this.repository.findOneBy({ ingredientId });
    this.ws.broadcast(EwebSocketEvent.INVENTORY_UPDATE, { result });
  }
}
