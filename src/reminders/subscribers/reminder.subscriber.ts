/* eslint-disable prettier/prettier */
import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CronJob } from 'cron';
import { NotificationsService } from 'src/notifications/services/notifications.service';
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { Reminder } from '../entities/reminder.entity';
import { RemindersService } from '../services/reminders.service';
import { NotificationType } from 'src/common/constants/notification';

@EventSubscriber()
export class ReminderSubscriber implements EntitySubscriberInterface<Reminder> {
  private jobs: { [key: string]: CronJob } = {}; // Store active cron jobs

  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
    private readonly remindersService: RemindersService,
    private eventEmitter: EventEmitter2,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Reminder;
  }

  /**
   * Called after entity insert.
   */
  afterInsert(event: InsertEvent<Reminder>) {
    console.log(`A new reminder has been inserted: `, event.entity);
    this.handleReminderCreation(event.entity);
  }

  /**
   * Called after entity update.
   */
  afterUpdate(event: UpdateEvent<Reminder>) {
    console.log(`Reminder has been updated: `, event.entity);
    this.handleReminderReschedule(event.entity);
  }

  /**
   * Called after entity delete.
   */
  afterRemove(event: RemoveEvent<Reminder>) {
    console.log(`Reminder has been updated: `, event.entity);
    this.handleReminderCancel(event.entity.id);
  }

  async handleReminderCreation(reminder: Reminder) {
    const reminderTime = new Date(reminder.reminderDate);

    const job = new CronJob(reminderTime, async () => {
      // Emit notification when the time is reached
      // this.eventEmitter.emit('notification', {
      //   message: `Reminder: ${reminder.title}`,
      // });

      this.sendNotificationToClient(
        reminder.createdBy.id.toString(),
        `Reminder: ${reminder.title}`,
        NotificationType.ALARM,
        reminder,
      );

      // await this.remindersService.isNotifiedChange(reminder.id, false);

      // After the job is done, stop and delete it
      this.jobs[reminder.id]?.stop();
      delete this.jobs[reminder.id];
    });

    // Start the cron job
    job.start();

    // Store the job to manage it later (e.g., stop or delete)
    this.jobs[reminder.id] = job;
  }

  async handleReminderReschedule(reminder) {
    if (this.jobs[reminder.id]) {
      this.jobs[reminder.id].stop();
      delete this.jobs[reminder.id];
    }
    this.handleReminderCreation(reminder);
  }

  async handleReminderCancel(reminderId: number) {
    if (this.jobs[reminderId]) {
      this.jobs[reminderId].stop();
      delete this.jobs[reminderId];
    }
  }

  // Function to send the notification to a specific client
  sendNotificationToClient(clientId: string, message: string, type: string, data: any) {
    const clientSubject = this.notificationsService.getClient(clientId);

    if (clientSubject) {
      clientSubject.next({ data: { message, type, data } } as MessageEvent);
    } else {
      console.log(`Client with ID ${clientId} is not connected.`);
    }
  }
}
