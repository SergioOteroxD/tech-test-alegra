import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ingredients } from './ingredients.entity';
import { Ipurchase } from '../../core/model/purchase.model';

@Entity('purchases', { schema: 'public' })
export class Purchases implements Ipurchase {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'quantity', nullable: true })
  quantity: number;

  @Column('timestamp without time zone', {
    name: 'purchased_at',
    nullable: true,
    default: () => 'now()',
  })
  purchasedAt: Date;

  @Column('integer', { name: 'ingredient_id' })
  ingredientId: number;

  @ManyToOne(() => Ingredients, (ingredients) => ingredients.purchases)
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
