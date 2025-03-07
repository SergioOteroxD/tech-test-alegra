export interface RecipeIngredient {
  recipeId: number;
  ingredientId: number;
  quantity: number;
  ingredient: {
    id: number;
    name: string;
  };
}

export interface Recipe {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  recipeIngredients: RecipeIngredient[];
}
