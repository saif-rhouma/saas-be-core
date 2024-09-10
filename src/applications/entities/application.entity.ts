/* eslint-disable prettier/prettier */
import { Customer } from 'src/customers/entities/customer.entity';
import { File } from 'src/files/entities/file.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Product } from 'src/products/entities/product.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum PrintPOSType {
  A4 = 'A4',
  Thermal = 'Thermal',
}
@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  //! The Constraint for Unique May Be ADDED!
  @Column({
    nullable: false,
    length: 150,
  })
  name: string;

  @Column({
    nullable: true,
  })
  appLogo: string;

  @Column({
    nullable: true,
  })
  favicon: string;

  @Column('text', { default: PrintPOSType.A4 })
  printerPOS: PrintPOSType;

  @Column({
    nullable: true,
    length: 20,
  })
  currencySymbol: string;

  @Column({
    nullable: true,
  })
  taxPercentage: number;

  @Column('simple-json', {
    nullable: true,
  })
  address: {
    country: string;
    state: string;
    city: string;
    zipCode: string;
    street: string;
  };

  @ManyToOne(() => User, (user) => user.userOwnedApps)
  owner: User;

  @ManyToMany(() => User, (user) => user.applications, { cascade: true })
  users: User[];

  @OneToMany(() => Product, (product) => product.application)
  products: Product[];

  @OneToMany(() => Customer, (customer) => customer.application)
  customers: Customer[];

  @OneToMany(() => Plan, (plan) => plan.application)
  plans: Plan[];

  @OneToMany(() => Order, (order) => order.application)
  orders: Order[];

  @OneToMany(() => Payment, (payment) => payment.application)
  payments: Payment[];

  @OneToMany(() => Ticket, (ticket) => ticket.application)
  tickets: Ticket[];

  @OneToMany(() => File, (file) => file.application)
  files: File[];

  @OneToMany(() => Reminder, (reminder) => reminder.application)
  reminders: Reminder[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
