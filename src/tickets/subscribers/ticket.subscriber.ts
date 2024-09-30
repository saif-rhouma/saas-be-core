/* eslint-disable prettier/prettier */
import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationType } from 'src/common/constants/notification';
import { NotificationsGateway } from 'src/notifications/gateway/notifications.gateway';
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Ticket, TicketStatus } from '../entities/ticket.entity';

@EventSubscriber()
export class TicketSubscriber implements EntitySubscriberInterface<Ticket> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly notificationGateway: NotificationsGateway,
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
    // console.log(`A new ticket has been inserted: `, event.entity);
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
      ticket.member.id.toString(),
      `Ticket: ${ticket.topic}`,
      NotificationType.TICKET,
      ticket,
    );
  }

  async handleTicketClosed(ticket) {
    this.sendNotificationToClient(
      ticket.member.id.toString(),
      `Ticket: ${ticket.topic}`,
      NotificationType.TICKET,
      ticket,
    );
  }

  // Function to send the notification to a specific client
  sendNotificationToClient(clientId: string, message: string, type: NotificationType, data: any) {
    this.notificationGateway.handleNotificationMessage(clientId, { message, type, data });
  }
}
