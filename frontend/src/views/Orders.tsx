import { useQuery } from '@tanstack/react-query';
import { Salad } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { OrderCard } from '../components/OrderCard';
import { Pagination } from '../components/Pagination';
import { TabButton } from '../components/TabButton';
import { API } from '../config';
import { kitchenSocket } from '../lib/socket';
import { Order, ORDER_STATUS } from '../models/order';
import { ServerResponse } from '../models/response';
import { format } from '../lib/format-date';

type OrderCreateEventData = {
  orderId: number;
  status: ORDER_STATUS;
  recipe: { id: number; name: string };
  createdAt: string;
};

type OrderUpdateEventData = {
  orderId: string;
  status: ORDER_STATUS;
};

const handleRequestOrder = () =>
  fetch(API.ORDER_REQUEST_ORDER, {
    method: 'POST',
  });
const ordersFetcher = (page: number = 1) => {
  return async () => {
    const response = await fetch(`${API.ORDER_GET_ALL}?page=${page}&limit=10`);
    return await response.json();
  };
};

const useOrderView = () => {
  const [view, setView] = useState<'list' | 'status'>('list');

  return {
    current: view,
    setStatusView: () => setView('status'),
    setListView: () => setView('list'),
  };
};

export default function Orders() {
  const maxPageViewed = useRef(0);
  const [orders, setOrders] = useState<Order[]>([]);
  console.log('🚀 ~ Orders ~ orders:', orders);
  const ordersById = useMemo(() => {
    return orders.reduce((acc, order) => {
      acc[order.id] = order;
      return acc;
    }, {} as { [id: number]: Order });
  }, [orders]);

  const [page, setPage] = useState<number>(1);
  const { data: response } = useQuery<ServerResponse<Order[]>>({
    queryKey: ['orders', page],
    queryFn: ordersFetcher(page),
    refetchOnWindowFocus: false,
    enabled: page > maxPageViewed.current,
  });
  const view = useOrderView();

  useEffect(() => {
    if (page > maxPageViewed.current) maxPageViewed.current = page;
  }, [page]);

  useEffect(() => {
    if (response?.data) {
      const dataNotRepeated = response.data.filter(
        (order) => !ordersById[order.id]
      );
      setOrders((prevState) => [...prevState, ...dataNotRepeated]);
    }
  }, [response]);

  useEffect(() => {
    kitchenSocket.on('order_create', (data: OrderCreateEventData) => {
      console.log("🚀 ~ kitchenSocket.on ~ data:", data)
      setOrders((prevState) => [
        {
          id: data.orderId,
          status: data.status,
          recipe: {
            id: data.recipe.id,
            name: data.recipe.name,
          },
          createdAt: data.createdAt,
        } as Order,
        ...prevState,
      ]);
    });

    kitchenSocket.on('order_update', (data: OrderUpdateEventData) => {
      console.log("🚀 ~ kitchenSocket.on ~ data:", data)
      setOrders((prevState) => {
        const updatedOrders = prevState.map((order) => {
          if (order.id === parseInt(data.orderId)) {
            order.status = data.status;
          }
          return order;
        });
        return updatedOrders;
      });
    });

    return () => {
      kitchenSocket.off('order_create');
      kitchenSocket.off('order_update');
    };
  }, []);

  return (
    <div>
      <nav className="flex gap-2 mb-2">
        <TabButton
          variant={view.current === 'list' ? 'active' : 'default'}
          onClick={view.setListView}
        >
          Lista de Órdenes
        </TabButton>
        <TabButton
          variant={view.current === 'status' ? 'active' : 'default'}
          onClick={view.setStatusView}
        >
          Estado
        </TabButton>
        <div className="flex-1"></div>
        <Button onClick={handleRequestOrder}>
          <Salad className="w-4 h-4 mr-2" />
          Pedir Plato
        </Button>
      </nav>
      <hr className="h-0.5 w-full mb-4 text-gray-200" />
      {view.current === 'list' && response?.pagination && (
        <ListView
          orders={orders}
          pageState={{ value: page, dispatch: setPage }}
          pagination={response.pagination}
        />
      )}
      {view.current === 'status' && <StatusView orders={orders} />}
    </div>
  );
}

const ListView: React.FC<{
  orders: Order[];
  pageState: {
    value: number;
    dispatch: React.Dispatch<React.SetStateAction<number>>;
  };
  pagination: ServerResponse<Order[]>['pagination'];
}> = ({ orders, pageState, pagination }) => {
  const _orders = useMemo(() => {
    return orders.slice(
      (pageState.value - 1) * pagination.pageSize,
      pageState.value * pagination.pageSize
    );
  }, [pageState.value, orders]);
  console.log('🚀 ~ const_orders=useMemo ~ _orders:', _orders);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Historial de Órdenes
          </h3>
          <p className="text-sm text-gray-500">
            Aquí encontrarás el historial de órdenes
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="rounded-md border border-gray-200">
            <div className="grid grid-cols-4 border-b border-b-gray-200 p-3 font-medium">
              <div>Orden ID</div>
              <div>Platillo</div>
              <div>Estado</div>
              <div>Creación</div>
            </div>
            {_orders.map((order) => (
              <div
                key={`order-${order.id}`}
                className="grid grid-cols-4 items-center p-3"
              >
                <div>#{order.id}</div>
                <div>{order.recipe.name}</div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.status === 'PENDING'
                        ? 'bg-rose-100 text-rose-800'
                        : order.status === 'PREPARING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {order.status === 'PENDING' && 'Pendiente'}
                    {order.status === 'PREPARING' && 'Preparando'}
                    {order.status === 'COMPLETED' && 'Completado'}
                  </span>
                </div>
                <div>{format(order.createdAt)}</div>
              </div>
            ))}
          </div>
        </div>
        <Pagination
          limit={pagination.pageSize}
          onNext={() => pageState.dispatch((prevState) => prevState + 1)}
          onPrevious={() => pageState.dispatch((prevState) => prevState - 1)}
          page={pageState.value}
          totalSize={pagination.totalDocuments}
        />
      </div>
    </div>
  );
};

const StatusView: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const ordersByStatus = useMemo(() => {
    return {
      pending: orders.filter((order) => order.status === 'PENDING'),
      prepared: orders.filter((order) => order.status === 'PREPARING'),
      completed: orders.filter((order) => order.status === 'COMPLETED'),
    };
  }, [orders]);

  const pendingOrders = ordersByStatus.pending;
  const preparedOrders = ordersByStatus.prepared;
  const readyOrders = ordersByStatus.completed;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Pending Column */}
      <div className="flex flex-col space-y-4">
        <div className="rounded-t-md bg-amber-100 p-3">
          <h3 className="font-medium text-amber-800">Pendiente</h3>
          <p className="text-sm text-amber-700">
            {pendingOrders.length} órdenes
          </p>
        </div>
        <div className="flex flex-col space-y-3">
          {pendingOrders.map((order) => (
            <OrderCard key={`order-${order.id}`} order={order} />
          ))}
        </div>
      </div>

      {/* Prepared Column */}
      <div className="flex flex-col space-y-4">
        <div className="rounded-t-md bg-blue-100 p-3">
          <h3 className="font-medium text-blue-800">Preparado</h3>
          <p className="text-sm text-blue-700">
            {preparedOrders.length} órdenes
          </p>
        </div>
        <div className="flex flex-col space-y-3">
          {preparedOrders.map((order) => (
            <OrderCard key={`order-${order.id}`} order={order} />
          ))}
        </div>
      </div>

      {/* Completed Column */}
      <div className="flex flex-col space-y-4">
        <div className="rounded-t-md bg-green-100 p-3">
          <h3 className="font-medium text-green-800">Listo</h3>
          <p className="text-sm text-green-700">{readyOrders.length} órdenes</p>
        </div>
        <div className="flex flex-col space-y-3">
          {readyOrders.map((order) => (
            <OrderCard key={`order-${order.id}`} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};
