export interface Ingredient {
  ingredientId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  ingredient: {
    id: number;
    name: string;
  };
}
