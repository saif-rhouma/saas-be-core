/* eslint-disable prettier/prettier */
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    JoinTable,
  } from 'typeorm';
import { Order } from './order.entity';

export enum Status {
    Active = 'true',
    Inactive = 'false'
  }
  
  @Entity()
  export class Customer {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToMany(() => Order, (Order) => Order.Customers)
    @JoinTable()
    orders: Order[];
    
    @Column({
      nullable: false,
    })
    name: string;
  
    @Column({
        nullable: false,
      })        // how to generate ?
    city: string;
  
    @Column({
      nullable: true,
    })
    phoneNumber: number;
  
    @Column({
      nullable: true,
    })
    taxNumber :number;  // how to generate ?
  
    @Column({
        nullable: true,
      })
    Address: string;

    @Column('text', { default: Status.Active })
    isActive: string;
  }
  