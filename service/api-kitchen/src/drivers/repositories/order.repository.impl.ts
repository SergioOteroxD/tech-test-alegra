import { FindOptionsOrder, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { AppDataSource } from '../database/postgres.connect';
import { CustomError } from '../../common/types/custom-error';
import { Orders } from '../entities/orders.entity';

export class OrderRepository {
  private static instance: OrderRepository;
  private repository: Repository<Orders>;

  constructor() {
    this.repository = AppDataSource.getRepository(Orders);
  }

  // Método para obtener la instancia única
  public static getInstance(): OrderRepository {
    if (!OrderRepository.instance) {
      OrderRepository.instance = new OrderRepository();
    }
    return OrderRepository.instance;
  }

  async create(orders: Partial<Orders>): Promise<Orders> {
    try {
      const newOrders = this.repository.create(orders);
      return await this.repository.save(newOrders);
    } catch (error) {
      throw new CustomError({ message: 'ERROR', code: 500 }, 'IOrdersRepository.create', 'Business');
    }
  }

  async getById(
    id: number,
    relations?: FindOptionsRelations<Orders>,
    select?: FindOptionsSelect<Orders>,
  ): Promise<Orders | null> {
    return await this.repository.findOne({ where: { id }, relations, select });
  }

  async getAll(
    page: number,
    limit: number,
    filter: FindOptionsWhere<Orders>,
    relations?: FindOptionsRelations<Orders>,
    projection?: FindOptionsSelect<Orders>,
    sort?: FindOptionsOrder<Orders>,
  ): Promise<Orders[]> {
    return await this.repository.find({
      where: filter,
      take: limit,
      skip: limit * (page - 1),
      relations,
      select: projection,
      order: sort,
    });
  }

  async getTotal(filter: FindOptionsWhere<Orders>): Promise<number> {
    return await this.repository.count({ where: filter });
  }
  async update(id: number, data: Partial<Orders>): Promise<Orders | null> {
    await this.repository.update(id, data);
    return await this.repository.findOneBy({ id });
  }
}
