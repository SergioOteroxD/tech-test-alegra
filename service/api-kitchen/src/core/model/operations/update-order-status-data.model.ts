import { Iorders } from '../order.model';

export interface IupdateOrderStatusData extends Pick<Iorders, 'status'> {}
