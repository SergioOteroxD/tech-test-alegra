import { Column, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Inventory } from './inventory.entity';
import { Purchases } from './purchase.entity';
import { RecipeIngredients } from './recipe-ingredients.entity';

@Entity('ingredients', { schema: 'public' })
export class Ingredients {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', unique: true, length: 50 })
  name: string;

  @OneToOne(() => Inventory, (inventory) => inventory.ingredient)
  inventory?: Inventory;

  @OneToMany(() => Purchases, (purchases) => purchases.ingredient)
  purchases?: Purchases[];

  @OneToMany(() => RecipeIngredients, (recipeIngredients) => recipeIngredients.ingredient)
  recipeIngredients?: RecipeIngredients[];
}
