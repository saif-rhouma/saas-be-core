/* eslint-disable prettier/prettier */
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshToken } from '../../auth/entities/token.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { Application } from 'src/applications/entities/application.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToMany(() => Application, (application) => application.users)
  @JoinTable()
  applications: Application[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => Permission, (permission) => permission.users)
  permissions: Permission[];

  @OneToMany(() => RefreshToken, (token) => token.user)
  tokens: RefreshToken[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }
}
