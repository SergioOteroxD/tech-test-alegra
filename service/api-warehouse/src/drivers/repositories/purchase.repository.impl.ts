import { FindOptionsOrder, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { AppDataSource } from '../database/postgres.connect';
import { CustomError } from '../../common/types/custom-error';
import { Purchases } from '../entities/purchase.entity';

export class PurchaseRepository {
  private static instance: PurchaseRepository;
  private repository: Repository<Purchases>;

  constructor() {
    this.repository = AppDataSource.getRepository(Purchases);
  }

  // Método para obtener la instancia única
  public static getInstance(): PurchaseRepository {
    if (!PurchaseRepository.instance) {
      PurchaseRepository.instance = new PurchaseRepository();
    }
    return PurchaseRepository.instance;
  }

  async create(
    orders: Omit<Purchases, 'id' | 'createdAt' | 'updatedAt' | 'purchasedAt' | 'ingredient'>,
  ): Promise<Purchases> {
    try {
      const newPurchases = this.repository.create(orders);
      return await this.repository.save(newPurchases);
    } catch (error) {
      console.log('🚀 ~ PurchaseRepository ~ error:', error);
      throw new CustomError({ message: 'ERROR', code: 500 }, 'IPurchasesRepository.create', 'Business');
    }
  }

  async getById(id: number): Promise<Purchases | null> {
    return await this.repository.findOneBy({ id });
  }

  async getAll(
    page: number,
    limit: number,
    filter: FindOptionsWhere<Purchases>,
    projection?: FindOptionsSelect<Purchases>,
    sort?: FindOptionsOrder<Purchases>,
  ): Promise<Purchases[]> {
    return await this.repository.find({
      where: filter,
      take: limit,
      skip: page * limit,
      select: projection,
      order: sort,
    });
  }

  async findAll(
    filter: FindOptionsWhere<Purchases>,
    projection?: FindOptionsSelect<Purchases>,
    relations?: FindOptionsRelations<Purchases>,
    sort?: FindOptionsOrder<Purchases>,
  ): Promise<Purchases[]> {
    return await this.repository.find({ where: filter, select: projection, relations, order: sort });
  }

  async update(id: number, data: Partial<Purchases>): Promise<Purchases | null> {
    await this.repository.update(id, data);
    return await this.repository.findOneBy({ id });
  }
}
