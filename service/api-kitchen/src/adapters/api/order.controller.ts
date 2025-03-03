import { Request, Response } from 'express';
import { ResponseUtil } from '../../common/util/response.util';
import { CustomError } from '../../common/types/custom-error';
import { Roles } from '../decorator/roles.decorator';
import { Erole } from '../../common/enum/role.enum';
import { RequestOrderUC } from '../../core/use_case/request-order.uc';

export class OrderController {
  private requestOrderUc: RequestOrderUC;

  constructor() {
    this.requestOrderUc = RequestOrderUC.getInstance();
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

  @Roles(Erole.ADMIN, Erole.SUPER_ADMIN)
  public static async protected(req: Request, res: Response) {
    try {
      // Ejecutar el caso de uso de logout
      ResponseUtil.success(res, {
        code: 'OK',
        message: 'La consulta se ejecuto correctamente',
        status: 200,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}
