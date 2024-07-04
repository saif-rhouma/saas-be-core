/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  description: string;

  @ManyToMany(() => User, (user) => user.permissions, { cascade: true })
  @JoinTable()
  users: User[];

  @ManyToMany(() => Role, (role) => role.permissions, { cascade: true })
  @JoinTable()
  roles: Role[];
}
