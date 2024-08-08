/* eslint-disable prettier/prettier */
import { Product } from 'src/products/entities/product.entity';
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

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
