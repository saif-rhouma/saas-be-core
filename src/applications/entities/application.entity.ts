/* eslint-disable prettier/prettier */
import { User } from 'src/users/entities/user.entity';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  users: User[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
