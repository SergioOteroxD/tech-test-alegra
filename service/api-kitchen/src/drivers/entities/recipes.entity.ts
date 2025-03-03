import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './orders.entity';
import { RecipeIngredients } from './recipe-ingredients.entity';
import { Irecipe } from '../../core/model/recipe.model';

@Entity('recipes', { schema: 'public' })
export class Recipes implements Irecipe {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', unique: true, length: 50 })
  name: string;

  @OneToMany(() => Orders, (orders) => orders.recipe)
  orders: Orders[];

  @OneToMany(
    () => RecipeIngredients,
    (recipeIngredients) => recipeIngredients.recipe
  )
  recipeIngredients: RecipeIngredients[];
}
