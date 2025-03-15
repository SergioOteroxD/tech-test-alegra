import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Ingredients } from './ingredients.entity';
import { Recipes } from './recipes.entity';

@Entity('recipe_ingredients', { schema: 'public' })
export class RecipeIngredients {
  @Column('integer', { primary: true, name: 'recipe_id' })
  recipeId: number;

  @Column('integer', { primary: true, name: 'ingredient_id' })
  ingredientId: number;

  @Column('integer', { name: 'quantity' })
  quantity: number;

  @ManyToOne(() => Ingredients, (ingredients) => ingredients.recipeIngredients)
  @JoinColumn([{ name: 'ingredient_id', referencedColumnName: 'id' }])
  ingredient?: Ingredients;

  @ManyToOne(() => Recipes, (recipes) => recipes.recipeIngredients)
  @JoinColumn([{ name: 'recipe_id', referencedColumnName: 'id' }])
  recipe: Recipes;
}
