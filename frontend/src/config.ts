export enum API {
  ORDER_GET_ALL = '/kitchen/kitchen/v1/order',
  ORDER_REQUEST_ORDER = '/kitchen/kitchen/v1/order/request-order',
  INGREDIENTS_GET_ALL = '/warehouse/warehouse/v1/ingredient',
  INGREDIENTS_PURCHASE = '/warehouse/warehouse/v1/purchases',
  RECIPES_GET_ALL = '/kitchen/kitchen/v1/recipes',
}

export const PAGINATION_LIMIT = 10;
