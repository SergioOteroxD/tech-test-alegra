import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ingredients } from './ingredients.entity';

@Entity('purchases', { schema: 'public' })
export class Purchases {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'quantity', nullable: true })
  quantity: number | null;

  @Column('timestamp without time zone', {
    name: 'purchased_at',
    nullable: true,
    default: () => 'now()',
  })
  purchasedAt: Date | null;

  @ManyToOne(() => Ingredients, (ingredients) => ingredients.purchases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'ingredient_id', referencedColumnName: 'id' }])
  ingredient: Ingredients;
}
