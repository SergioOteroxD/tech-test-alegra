export enum ORDER_STATUS {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  COMPLETED = 'COMPLETED',
}

export interface Order {
  id: number;
  status: ORDER_STATUS;
  createdAt: string;
  updatedAt: string;
  recipeId: number;
  recipe: {
    id: number;
    name: string;
  };
}
