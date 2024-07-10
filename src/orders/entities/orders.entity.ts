/* eslint-disable prettier/prettier */
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
  } from 'typeorm';
import { Services } from './services.entity';
  
  @Entity()
  export class Orders {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToMany(() => Services, (Services) => Services.orders)
    @JoinTable()
    services: Services[];

    serviceName: string;   //todo add new  entity 
    
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
  