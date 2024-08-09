/* eslint-disable prettier/prettier */
import { Application } from 'src/applications/entities/application.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  Hight = 'Hight',
}

export enum TicketStatus {
  Open = 'Open',
  Closed = 'Closed',
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  topic: string;

  @Column({
    nullable: true,
  })
  description: string;

  @ManyToOne(() => User, (user) => user.members)
  member: User;

  @Column('text', { default: Priority.Medium })
  priority: Priority;

  @Column('text', { default: TicketStatus.Open })
  status: TicketStatus;

  @ManyToOne(() => User, (user) => user.tickets)
  createdBy: User;

  @ManyToOne(() => Application, (application) => application.tickets)
  application: Application;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
