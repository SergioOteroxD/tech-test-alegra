import { EstatusOrder } from '../../common/enum/status-order.enum';


export interface Iorders {
    id: number;

    status?: EstatusOrder;

    recipeId: number;

    createdAt: Date;

    updatedAt: Date;
}
