/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { NotificationsController } from './controllers/notifications.controller';
// import { RemindersModule } from 'src/reminders/reminders.module';
import { NotificationsService } from './services/notifications.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RemindersModule } from 'src/reminders/reminders.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { NotificationsGateway } from './gateway/notifications.gateway';
@Module({
  controllers: [NotificationsController],
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    forwardRef(() => RemindersModule),
    forwardRef(() => TicketsModule),
  ],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
