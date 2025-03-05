import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipes } from './recipes.entity';
import { Iorders } from '../../core/model/order.model';
import { EstatusOrder } from '../../common/enum/status-order.enum';

@Entity('orders', { schema: 'public' })
export class Orders implements Iorders {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'status', nullable: true, length: 20, default: () => "'PENDING'" })
  status?: EstatusOrder;

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

  @ManyToOne(() => Recipes, (recipes) => recipes.orders, {
    onDelete: 'SET NULL',
  })

  @Column('integer',{ name: 'recipe_id', })
  recipeId: number;

  @JoinColumn([{ name: 'recipe_id', referencedColumnName: 'id' }])
  recipe?: Recipes;
}
