export interface Purchase {
  id: number;
  quantity: number;
  ingredientId: number;
  createdAt: string;
  updatedAt: string;
  ingredient: {
    id: number;
    name: string;
  };
}
