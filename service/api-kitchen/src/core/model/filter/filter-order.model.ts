import { EstatusOrder } from '../../../common/enum/status-order.enum';
export interface IfilterOrder {
  status: EstatusOrder[];
  recipeId: number;
}
