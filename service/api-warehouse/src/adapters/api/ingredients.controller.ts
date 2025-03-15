import { Response } from 'express';
import { ResponseUtil } from '../../common/util/response.util';
import { CustomError } from '../../common/types/custom-error';
import { QueryInventoryUC } from '../../core/use_case/query-ingredients.uc';

export class IngredientsController {
  private queryIngredientsUc: QueryInventoryUC;

  constructor() {
    this.queryIngredientsUc = QueryInventoryUC.getInstance();
  }

  async getAll(req: any, res: Response): Promise<Response> {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      // Ejecutar el caso de uso de login
      const response = await this.queryIngredientsUc.getAll(page, limit);
      return ResponseUtil.success(res, response);
    } catch (error) {
      console.log('🚀 ~ InventaryController ~ requestOrder ~ error:', error);
      if (error instanceof CustomError) {
        return res.status(error.error.code).json({ error: error.error.message });
      }
      return res.status(500).json({ message: error });
    }
  }
}
