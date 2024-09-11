/* eslint-disable prettier/prettier */
import { Application } from 'src/applications/entities/application.entity';
import { ProductToOrder } from 'src/orders/entities/product_order.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Supplying } from 'src/stock/entities/supplying.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductAddon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  isActive: boolean;

  @ManyToOne(() => Application, (application) => application.products)
  application: Application;
}
