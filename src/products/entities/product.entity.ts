/* eslint-disable prettier/prettier */
import { Application } from 'src/applications/entities/application.entity';
import { ProductToOrder } from 'src/orders/entities/product_order.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
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

  @OneToMany(() => Plan, (plan) => plan.product)
  plans: Plan[];

  @OneToMany(() => ProductToOrder, (productToOrder) => productToOrder.product, { cascade: true })
  productToOrder!: ProductToOrder[];
}
