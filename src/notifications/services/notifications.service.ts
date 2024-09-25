/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class NotificationsService {
  // Store active clients with their clientId
  private clients: { [clientId: string]: Subject<MessageEvent> } = {};

  // Add a client to the list
  addClient(clientId: string): Subject<MessageEvent> {
    const clientSubject = new Subject<MessageEvent>();
    this.clients[clientId] = clientSubject;
    return clientSubject;
  }

  // Remove a client when they disconnect
  removeClient(clientId: string): void {
    if (this.clients[clientId]) {
      this.clients[clientId].complete();
      delete this.clients[clientId];
    }
  }

  // Get the client's Subject to send them messages
  getClient(clientId: string): Subject<MessageEvent> | undefined {
    return this.clients[clientId];
  }
}
