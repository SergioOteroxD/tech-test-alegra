import { FindOptionsOrder, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
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

  async create(orders: Omit<Orders, 'id' | 'createdAt' | 'updatedAt'>): Promise<Orders> {
    try {
      const newOrders = this.repository.create(orders);
      return await this.repository.save(newOrders);
    } catch (error) {
      throw new CustomError({ message: 'ERROR', code: 500 }, 'IOrdersRepository.create', 'Business');
    }
  }

  async getById(id: number): Promise<Orders | null> {
    return await this.repository.findOneBy({ id });
  }

  async getAll(
    page: number,
    limit: number,
    filter: FindOptionsWhere<Orders>,
    projection?: FindOptionsSelect<Orders>,
    sort?: FindOptionsOrder<Orders>,
  ): Promise<Orders[]> {
    return await this.repository.find({
      where: filter,
      take: limit,
      skip: page * limit,
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
