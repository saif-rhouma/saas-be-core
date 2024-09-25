/* eslint-disable prettier/prettier */
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Ticket, TicketStatus } from '../entities/ticket.entity';
import { NotificationsService } from 'src/notifications/services/notifications.service';
import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationType } from 'src/common/constants/notification';

@EventSubscriber()
export class TicketSubscriber implements EntitySubscriberInterface<Ticket> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
    private eventEmitter: EventEmitter2,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Ticket;
  }

  /**
   * Called after entity insert.
   */
  afterInsert(event: InsertEvent<Ticket>) {
    console.log(`A new ticket has been inserted: `, event.entity);
    this.handleTicketCreation(event.entity);
  }

  /**
   * Called after entity update.
   */
  afterUpdate(event: UpdateEvent<Ticket>) {
    console.log(`Ticket has been updated: `, event.entity);
    if (event.entity.status === TicketStatus.Closed) {
      this.handleTicketClosed(event.entity);
    }
  }

  async handleTicketCreation(ticket: Ticket) {
    this.sendNotificationToClient(
      ticket.createdBy.id.toString(),
      `Ticket: ${ticket.topic}`,
      NotificationType.TICKET,
      ticket,
    );
  }

  async handleTicketClosed(ticket) {
    this.sendNotificationToClient(
      ticket.createdBy.id.toString(),
      `Ticket: ${ticket.topic}`,
      NotificationType.TICKET,
      ticket,
    );
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
