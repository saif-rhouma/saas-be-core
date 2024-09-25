/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NotificationsController } from './controllers/notifications.controller';
// import { RemindersModule } from 'src/reminders/reminders.module';
import { NotificationsService } from './services/notifications.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  controllers: [NotificationsController],
  imports: [ScheduleModule.forRoot(), EventEmitterModule.forRoot()],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
