import { In } from 'typeorm';
import { CustomError } from '../../common/types/custom-error';
import { IresponseBase, ResponseBase, ResponseQuery } from '../../common/types/response-base.model';
import { InventoryRepository } from '../../drivers/repositories/inventory.repository.impl';

export class QueryInventoryUC {
  private static instance: QueryInventoryUC;

  private inventoryDriver: InventoryRepository;

  constructor() {
    this.inventoryDriver = InventoryRepository.getInstance();
  }

  public static getInstance(): QueryInventoryUC {
    if (!QueryInventoryUC.instance) {
      QueryInventoryUC.instance = new QueryInventoryUC();
    }
    return QueryInventoryUC.instance;
  }

  async getAll(page: number, limit: number): Promise<IresponseBase> {
    // Buscar al usuario por el correo electrónico
    try {
      const filter = undefined;

      const total: number = await this.inventoryDriver.getTotal(filter);

      if (total == 0)
        return new ResponseBase({
          code: 'NOT_FOUND',
          message: 'No se encontró información.',
          status: 404,
        });

      const data = await this.inventoryDriver.getAll(
        page,
        limit,
        filter,
        { ingredient: true },
        { ingredientId: true, quantity: true, createdAt: true, updatedAt: true, ingredient: { id: true, name: true } },
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
      const data = await this.inventoryDriver.getById(orderId);
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
