import { Response } from 'express';
import { ResponseUtil } from '../../common/util/response.util';
import { CustomError } from '../../common/types/custom-error';
import { RequestOrderUC } from '../../core/use_case/request-order.uc';
import { QueryOrderUC } from '../../core/use_case/query-order.uc';

export class OrderController {
  private requestOrderUc: RequestOrderUC;
  private queryOrderUc: QueryOrderUC;

  constructor() {
    this.requestOrderUc = RequestOrderUC.getInstance();
    this.queryOrderUc = QueryOrderUC.getInstance();
  }

  async requestOrder(req: any, res: Response): Promise<Response> {
    try {
      // Ejecutar el caso de uso de login
      const response = await this.requestOrderUc.requestOrder();
      return ResponseUtil.success(res, response);
    } catch (error) {
      console.log('🚀 ~ OrderController ~ requestOrder ~ error:', error);
      if (error instanceof CustomError) {
        return res.status(error.error.code).json({ error: error.error.message });
      }
      return res.status(500).json({ message: error });
    }
  }

  async getAllOrder(req: any, res: Response): Promise<Response> {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      // Ejecutar el caso de uso de login
      const response = await this.queryOrderUc.getAll(page, limit, req.query);
      return ResponseUtil.success(res, response);
    } catch (error) {
      console.log('🚀 ~ OrderController ~ requestOrder ~ error:', error);
      if (error instanceof CustomError) {
        return res.status(error.error.code).json({ error: error.error.message });
      }
      return res.status(500).json({ message: error });
    }
  }
}
