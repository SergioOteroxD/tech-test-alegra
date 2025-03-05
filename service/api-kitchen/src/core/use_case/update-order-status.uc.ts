import { EstatusOrder } from '../../common/enum/status-order.enum';
import { CustomError } from '../../common/types/custom-error';
import { IresponseBase, ResponseBase } from '../../common/types/response-base.model';
import { OrderRepository } from '../../drivers/repositories/order.repository.impl';
import { IupdateOrderStatusData } from '../model/operations/update-order-status-data.model';

export class UpdateOrderStatusUC {
  private static instance: UpdateOrderStatusUC;

  private orderDriver: OrderRepository;

  constructor() {
    this.orderDriver = OrderRepository.getInstance();
  }

  public static getInstance(): UpdateOrderStatusUC {
    if (!UpdateOrderStatusUC.instance) {
      UpdateOrderStatusUC.instance = new UpdateOrderStatusUC();
    }
    return UpdateOrderStatusUC.instance;
  }

  async update(orderId: number, data: IupdateOrderStatusData): Promise<IresponseBase> {
    // Buscar al usuario por el correo electrónico
    try {
      const order = await this.orderDriver.getById(orderId);

      if (!order) {
        return new ResponseBase({
          code: 'UPD_ORDER_NOT_FOUND',
          message: 'No se encontró la orden.',
          status: 404,
        });
      }
      // Validar que el cambio de estado sea válido
      if (
        (order.status === EstatusOrder.PENDING && data.status !== EstatusOrder.PREPARING) ||
        (order.status === EstatusOrder.PREPARING && data.status !== EstatusOrder.COMPLETED) ||
        order.status === EstatusOrder.COMPLETED
      ) {
        return new ResponseBase({
          code: 'UPD_ORDER_INVALID_STATUS',
          message: 'El cambio de estado de la orden no es válido.',
          status: 400,
        });
      }

      // Agregar tarea de traer ingredientes
      await this.orderDriver.update(orderId, data);

      return new ResponseBase(
        {
          code: 'UPD_ORDER_OK',
          message: 'La orden se ha solicitado correctamente.',
          status: 200,
        },
        { orderId: order.id, ...data },
      );
    } catch (error) {
      console.log('🚀 ~ UpdateOrderStatusUC ~ update ~ error:', error);
      return new CustomError({ message: 'Error', code: 500 }, 'RequestOrderUC.requestOrder', 'Business');
    }
  }
}
