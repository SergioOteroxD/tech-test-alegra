import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipes } from './recipes.entity';
import { Iorders } from '../../core/model/order.model';
import { EstatusOrder } from '../../common/enum/status-order.enum';

@Index('orders_pkey', ['id'], { unique: true })
@Entity('orders', { schema: 'public' })
export class Orders implements Iorders {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'status', length: 20 })
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

  @Column('integer', { name: 'recipe_id' })
  recipeId: number;

  @ManyToOne(() => Recipes, (recipes) => recipes.orders)
  @JoinColumn([{ name: 'recipe_id', referencedColumnName: 'id' }])
  recipe: Recipes;
}
