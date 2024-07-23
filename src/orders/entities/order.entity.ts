/* eslint-disable prettier/prettier */
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    ManyToOne,
    JoinTable,
  } from 'typeorm';
import { Service } from './service.entity';
import { Customer } from './customer.entity';
  
  @Entity()
  export class Order {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToMany(() => Service, (Service) => Service.orders)
    @JoinTable()
    services: Service[];

    @ManyToOne(() => Customer, (Customer) => Customer.orders)
    @JoinTable()
    Customers: Customer[];

   // serviceName: string;   //todo add new  entity 
    
    @Column({
      nullable: false,
    })
    color: string;
  
    @Column()        // how to generate ?
    Rate: number;
  
    @Column({
      nullable: false,
    })
    quantity: number;
  
    @Column({
      nullable: true,
    })
    totale:number;  // how to generate ?
  
    @CreateDateColumn()
    orderDate: Date;

    @CreateDateColumn()
    orderDelivery: Date;
  }
  