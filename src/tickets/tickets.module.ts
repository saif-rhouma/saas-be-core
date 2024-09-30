import { forwardRef, Module } from '@nestjs/common';
import { TicketsController } from './controllers/tickets.controller';
import { TicketsService } from './services/tickets.service';
import { UsersModule } from 'src/users/users.module';
import { ApplicationsModule } from 'src/applications/applications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Application } from 'src/applications/entities/application.entity';
import { User } from 'src/users/entities/user.entity';
import { TicketMessage } from './entities/ticket-message.entity';
import { TicketMessagesService } from './services/ticket-messages.service';
import { TicketMessagesController } from './controllers/ticket-messages.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { TicketSubscriber } from './subscribers/ticket.subscriber';

@Module({
  controllers: [TicketsController, TicketMessagesController],
  providers: [TicketsService, TicketMessagesService, TicketSubscriber],
  imports: [
    UsersModule,
    ApplicationsModule,
    // NotificationsModule,
    forwardRef(() => NotificationsModule),
    TypeOrmModule.forFeature([User, Application, Ticket, TicketMessage]),
  ],
  exports: [TicketsService],
})
export class TicketsModule {}
