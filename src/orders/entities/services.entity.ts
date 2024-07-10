/* eslint-disable prettier/prettier */
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
  } from 'typeorm';
import { Orders } from './orders.entity';

  
export enum Status {
  Active = 'Active',
  Inactive = 'Inactive'
}
  
  @Entity()
  export class Services {
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

    @ManyToMany(() => Orders, (Orders) => Orders.services)
    @JoinTable()
    orders: Orders[];
  }
  