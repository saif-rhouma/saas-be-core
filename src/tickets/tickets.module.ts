import { Module } from '@nestjs/common';
import { TicketsController } from './controllers/tickets.controller';
import { TicketsService } from './services/tickets.service';
import { UsersModule } from 'src/users/users.module';
import { ApplicationsModule } from 'src/applications/applications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Application } from 'src/applications/entities/application.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [UsersModule, ApplicationsModule, TypeOrmModule.forFeature([User, Application, Ticket])],
})
export class TicketsModule {}
