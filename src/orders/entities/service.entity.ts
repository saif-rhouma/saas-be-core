/* eslint-disable prettier/prettier */
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
  } from 'typeorm';
import { Order } from './order.entity';

  
export enum Status {
  Active = 'Active',
  Inactive = 'Inactive'
}
  
  @Entity()
  export class Service {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      nullable: false,
    })
    name: string;   
    
    @Column({
      default: 0,
    })
    price: number;
  
    @Column('text', { default: Status.Active })   
    status: string;

    @ManyToMany(() => Order, (Order) => Order.services)
    @JoinTable()
    orders: Order[];
  }
  