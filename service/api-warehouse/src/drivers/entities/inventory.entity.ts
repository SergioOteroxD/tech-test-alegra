import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { Ingredients } from './ingredients.entity';
import { Iinventory } from '../../core/model/inventory.model';

@Entity('inventory', { schema: 'public' })
export class Inventory implements Iinventory {
  @Column('integer', { primary: true, name: 'ingredient_id' })
  ingredientId: number;

  @Column('integer', { name: 'quantity', default: () => '5' })
  quantity: number;

  @OneToOne(() => Ingredients, (ingredients) => ingredients.inventory)
  @JoinColumn([{ name: 'ingredient_id', referencedColumnName: 'id' }])
  ingredient: Ingredients;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date;

  @Column('timestamp without time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'now()',
  })
  updatedAt: Date;
}
