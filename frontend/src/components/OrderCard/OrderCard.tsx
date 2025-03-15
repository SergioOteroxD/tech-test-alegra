import { Order, ORDER_STATUS } from '../../models/order';
import { format } from '../../lib/format-date';
import { API } from '../../config';

export type OrderCardProps = {
  order: Order;
};

const handleUpdateStatus = async (id: number) => {
  await fetch(`${API.ORDER_GET_ALL}/${id}/update-status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'COMPLETED' }),
  });
};

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div
      className={`rounded-lg border border-l-4 ${
        order.status === ORDER_STATUS.PENDING
          ? 'border-l-amber-400'
          : order.status === ORDER_STATUS.PREPARING
          ? 'border-l-blue-400'
          : 'border-l-green-400'
      } bg-white p-4 shadow-sm`}
    >
      <div className="flex justify-between">
        <span className="font-medium">#{order.id}</span>
        <span className="text-sm text-gray-500">{format(order.createdAt)}</span>
      </div>
      <div className="flex items-center justify-between mt-2 text-sm">
        <p>{order.recipe.name}</p>
        {order.status === ORDER_STATUS.PREPARING && (
          <button
            type="button"
            onClick={() => handleUpdateStatus(order.id)}
            className="rounded-sm px-2 py-1 font-medium bg-green-200 duration-200 transition-colors hover:bg-green-300"
          >
            Listo
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
