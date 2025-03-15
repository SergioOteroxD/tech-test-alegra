import { In } from 'typeorm';
import { CustomError } from '../../common/types/custom-error';
import { IresponseBase, ResponseBase, ResponseQuery } from '../../common/types/response-base.model';
import { OrderRepository } from '../../drivers/repositories/order.repository.impl';
import { IfilterOrder } from '../model/filter/filter-order.model';

export class QueryOrderUC {
  private static instance: QueryOrderUC;

  private orderDriver: OrderRepository;

  constructor() {
    this.orderDriver = OrderRepository.getInstance();
  }

  public static getInstance(): QueryOrderUC {
    if (!QueryOrderUC.instance) {
      QueryOrderUC.instance = new QueryOrderUC();
    }
    return QueryOrderUC.instance;
  }

  async getAll(page: number, limit: number, _filter: IfilterOrder): Promise<IresponseBase> {
    // Buscar al usuario por el correo electrónico
    try {
      const filter = {};
      if (_filter?.status?.length > 0) filter['status'] = In(_filter.status);
      if (_filter.recipeId) filter['recipeId'] = _filter.recipeId;

      const total: number = await this.orderDriver.getTotal(filter);

      if (total == 0)
        return new ResponseBase({
          code: 'NOT_FOUND',
          message: 'No se encontró información.',
          status: 404,
        });

      const data = await this.orderDriver.getAll(
        page,
        limit,
        filter,
        { recipe: true },
        { id: true, createdAt: true, recipe: { name: true, id: true }, status: true, recipeId: true, updatedAt: true },
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
      const data = await this.orderDriver.getById(orderId);
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
