import { useQuery } from '@tanstack/react-query';
import { Dispatch, useEffect, useRef, useState } from 'react';
import { IngredientCard } from '../components/IngredientCard';
import { Pagination } from '../components/Pagination';
import { TabButton } from '../components/TabButton';
import { API } from '../config';
import { warehouseSocket } from '../lib/socket';
import { Ingredient } from '../models/ingredient';
import { Purchase } from '../models/purchase';
import { ServerResponse } from '../models/response';
import { format } from '../lib/format-date';

const useInventoryView = () => {
  const [view, setView] = useState<'ingredients' | 'purchases'>('ingredients');
  return {
    current: view,
    setIngredientView: () => setView('ingredients'),
    setPurchaseView: () => setView('purchases'),
  };
};

const purchaseHistoryFetcher = (page: number = 1) => {
  return async () => {
    const response = await fetch(
      `${API.INGREDIENTS_PURCHASE}?page=${page}&limit=10`
    );
    return await response.json();
  };
};

export default function Inventory() {
  const maxPageViewed = useRef(0);
  const [page, setPage] = useState(1);

  const { data: response } = useQuery<ServerResponse<Purchase[]>>({
    queryKey: ['purchases', page],
    queryFn: purchaseHistoryFetcher(page),
    enabled: page > maxPageViewed.current,
  });

  useEffect(() => {
    if (page > maxPageViewed.current) maxPageViewed.current = page;
  }, [page]);

  const view = useInventoryView();
  return (
    <div>
      <div className="flex gap-2">
        <TabButton
          variant={view.current === 'ingredients' ? 'active' : 'default'}
          onClick={view.setIngredientView}
        >
          Bodega de Alimentos
        </TabButton>
        <TabButton
          variant={view.current === 'purchases' ? 'active' : 'default'}
          onClick={view.setPurchaseView}
        >
          Historial de Compras
        </TabButton>
      </div>
      <hr className="h-0.5 w-full mt-2 mb-4 text-gray-200" />
      <div>
        {view.current === 'ingredients' && <Ingredients />}
        {view.current === 'purchases' && response?.pagination && (
          <Purchases
            data={response.data}
            pagination={response.pagination}
            pageState={{
              value: page,
              dispatch: setPage,
            }}
          />
        )}
      </div>
    </div>
  );
}

type InventoryUpdateEventData = {
  result: {
    id: number;
    ingredientId: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  };
};

const ingredientsFetcher = async () => {
  const response = await fetch(API.INGREDIENTS_GET_ALL);
  const result = await response.json();
  return result?.data;
};

function Ingredients() {
  const { data } = useQuery<Ingredient[]>({
    queryKey: ['ingredients'],
    queryFn: ingredientsFetcher,
    refetchOnWindowFocus: false,
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    if (data) setIngredients(data);
  }, [data]);

  useEffect(() => {
    warehouseSocket.on('inventory_update', (data: InventoryUpdateEventData) => {
      setIngredients((prevState) =>
        prevState.map((ingr) => {
          if (ingr.ingredientId === data.result.ingredientId) {
            return { ...ingr, quantity: data.result.quantity };
          }
          return ingr;
        })
      );
    });

    return () => {
      warehouseSocket.off('inventory_update');
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Ingredientes
          </h3>
          <p className="text-sm text-gray-500">
            Aquí puedes ver el stock actual
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 w-full">
            {ingredients.map((ingr) => (
              <IngredientCard
                key={`ingredient-${ingr.ingredientId}`}
                ingredient={ingr}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Purchases: React.FC<{
  data: Purchase[];
  pagination: ServerResponse<Purchase[]>['pagination'];
  pageState: {
    value: number;
    dispatch: Dispatch<React.SetStateAction<number>>;
  };
}> = ({ data, pagination, pageState }) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Historial de Compras
          </h3>
          <p className="text-sm text-gray-500">
            Aquí encontrarás el historial de compras
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="rounded-md border border-gray-200">
            <div className="grid grid-cols-4 border-b border-b-gray-200 p-3 font-medium">
              <div>Compra ID</div>
              <div>Ingrediente</div>
              <div>Cantidad</div>
              <div>Fecha</div>
            </div>
            {!!data &&
              data.map((purchase) => (
                <div
                  key={`inventory-${purchase.id}`}
                  className="grid grid-cols-4 items-center p-3"
                >
                  <div>#{purchase.id}</div>
                  <div className="capitalize">{purchase.ingredient.name}</div>
                  <div>{purchase.quantity}</div>
                  <div>{format(purchase.createdAt)}</div>
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
