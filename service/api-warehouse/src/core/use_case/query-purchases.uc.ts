import { CustomError } from '../../common/types/custom-error';
import { IresponseBase, ResponseBase, ResponseQuery } from '../../common/types/response-base.model';
import { PurchaseRepository } from '../../drivers/repositories/purchase.repository.impl';
import { IfilterPurchase } from '../model/filter/filter-purchases.model';

export class QueryPurchasesUC {
  private static instance: QueryPurchasesUC;

  private purchaseDriver: PurchaseRepository;

  constructor() {
    this.purchaseDriver = PurchaseRepository.getInstance();
  }

  public static getInstance(): QueryPurchasesUC {
    if (!QueryPurchasesUC.instance) {
      QueryPurchasesUC.instance = new QueryPurchasesUC();
    }
    return QueryPurchasesUC.instance;
  }

  async getAll(page: number, limit: number, _filter: IfilterPurchase): Promise<IresponseBase> {
    // Buscar al usuario por el correo electrónico
    try {
      const filter = {};
      if (_filter.ingredientId) filter['ingredientId'] = _filter.ingredientId;
      const total: number = await this.purchaseDriver.getTotal(filter);

      if (total == 0)
        return new ResponseBase({
          code: 'NOT_FOUND',
          message: 'No se encontró información.',
          status: 404,
        });

      const data = await this.purchaseDriver.getAll(
        page,
        limit,
        filter,
        { ingredient: true },
        {
          id: true,
          ingredientId: true,
          quantity: true,
          createdAt: true,
          updatedAt: true,
          ingredient: { id: true, name: true },
        },
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
      const data = await this.purchaseDriver.getById(orderId);
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
