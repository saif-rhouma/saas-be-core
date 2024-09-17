/* eslint-disable prettier/prettier */
import { Application } from 'src/applications/entities/application.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductToOrder } from './product_order.entity';
import { Payment } from 'src/payments/entities/payment.entity';

export enum OrderStatus {
  Draft = 'Draft',
  InProcess = 'InProcess',
  Ready = 'Ready',
  Delivered = 'Delivered',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  orderDate: Date;

  @Column({
    nullable: true,
  })
  deliveryDate: Date;

  @Column({
    nullable: true,
    default: 0,
  })
  orderPaymentAmount: number;

  @Column({
    nullable: true,
    default: 0,
  })
  totalOrderAmount: number;

  @Column('text', { default: OrderStatus.Draft })
  status: OrderStatus;

  @Column('boolean', { default: false })
  isHidden: boolean;

  @OneToMany(() => ProductToOrder, (productToOrder) => productToOrder.order)
  productToOrder!: ProductToOrder[];

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @ManyToOne(() => User, (user) => user.orders)
  createdBy: User;

  @ManyToOne(() => Application, (application) => application.orders)
  application: Application;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
