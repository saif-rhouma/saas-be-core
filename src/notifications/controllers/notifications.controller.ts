/* eslint-disable prettier/prettier */
import { Controller, Get, MessageEvent, Param, Query, Req, Res, Sse } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Observable, Subject } from 'rxjs';
import { NotificationsService } from '../services/notifications.service';
import { TicketsService } from 'src/tickets/services/tickets.service';
import { Request, Response } from 'express';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Controller('notifications')
export class NotificationsController {
  private notificationSubject = new Subject<MessageEvent>();

  // Store connections based on client ID
  public clients: { [clientId: string]: Subject<MessageEvent> } = {};

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly notificationsService: NotificationsService,
    private readonly ticketsService: TicketsService,
  ) {}

  // @Sse('reminders')
  // async sse(
  //   @Query('clientId') clientId,
  //   @Query('appId') appId,
  //   @Req() request: Request,
  // ): Promise<Observable<MessageEvent>> {
  //   if (!clientId || !appId) {
  //     throw new Error('ClientId and AppId rre required');
  //   }

  //   // const tickets = await this.ticketsService.getNotificationTickets(appId, clientId);
  //   console.log(`Client ${clientId} Connected | AppId : ${appId}`);
  //   // Add the client to the service
  //   const clientSubject = this.notificationsService.addClient(clientId);

  //   // const clientSubjectClient = this.notificationsService.getClient(clientId);

  //   // if (clientSubject) {
  //   //   // setInterval(() => {
  //   //   //   clientSubjectClient.next({
  //   //   //     data: { message: 'TEST MESSAGE', type: 'ALARM', data: payloadMock },
  //   //   //     lastEventId: '',
  //   //   //     origin: '',
  //   //   //     ports: [],
  //   //   //     source: undefined,
  //   //   //     initMessageEvent: function (
  //   //   //       type: string,
  //   //   //       bubbles?: boolean,
  //   //   //       cancelable?: boolean,
  //   //   //       data?: any,
  //   //   //       origin?: string,
  //   //   //       lastEventId?: string,
  //   //   //       source?: MessageEventSource | null,
  //   //   //       ports?: MessagePort[],
  //   //   //     ): void {
  //   //   //       throw new Error('Function not implemented.');
  //   //   //     },
  //   //   //     bubbles: false,
  //   //   //     cancelBubble: false,
  //   //   //     cancelable: false,
  //   //   //     composed: false,
  //   //   //     currentTarget: undefined,
  //   //   //     defaultPrevented: false,
  //   //   //     eventPhase: 0,
  //   //   //     isTrusted: false,
  //   //   //     returnValue: false,
  //   //   //     srcElement: undefined,
  //   //   //     target: undefined,
  //   //   //     timeStamp: 0,
  //   //   //     type: '',
  //   //   //     composedPath: function (): EventTarget[] {
  //   //   //       throw new Error('Function not implemented.');
  //   //   //     },
  //   //   //     initEvent: function (type: string, bubbles?: boolean, cancelable?: boolean): void {
  //   //   //       throw new Error('Function not implemented.');
  //   //   //     },
  //   //   //     preventDefault: function (): void {
  //   //   //       throw new Error('Function not implemented.');
  //   //   //     },
  //   //   //     stopImmediatePropagation: function (): void {
  //   //   //       throw new Error('Function not implemented.');
  //   //   //     },
  //   //   //     stopPropagation: function (): void {
  //   //   //       throw new Error('Function not implemented.');
  //   //   //     },
  //   //   //     NONE: 0,
  //   //   //     CAPTURING_PHASE: 1,
  //   //   //     AT_TARGET: 2,
  //   //   //     BUBBLING_PHASE: 3,
  //   //   //   });
  //   //   // }, 10000);
  //   // } else {
  //   //   console.log(`Client with ID ${clientId} is not connected.`);
  //   // }

  //   // Listen for client disconnection
  //   request.on('close', () => {
  //     console.log(`Client ${clientId} disconnected`);
  //     this.notificationsService.removeClient(clientId);
  //   });

  //   return clientSubject.asObservable();
  // }

  // @OnEvent('notification')
  // handleNotification(payload: { message: string; type: string; data: any }) {
  //   this.notificationSubject.next({
  //     data: { message: payload.message, type: payload.type, data: payload.data },
  //   } as MessageEvent);
  // }

  // // Remove a client when it disconnects (optional)
  // removeClient(clientId: string) {
  //   if (this.clients[clientId]) {
  //     this.clients[clientId].complete();
  //     delete this.clients[clientId];
  //   }
  // }

  // // Cleanup clients on application shutdown (optional)
  // onModuleDestroy() {
  //   Object.keys(this.notificationsService).forEach((clientId) => {
  //     this.notificationsService.removeClient(clientId);
  //   });
  // }

  // @Get('reminders')
  // handleClientConnection(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Query('clientId') clientId: string,
  //   @Query('appId') appId: string,
  // ) {
  //   if (!clientId || !appId) {
  //     throw new Error('ClientId and AppId rre required');
  //   }
  //   console.log(`Client ${clientId} Connected | AppId : ${appId}`);
  //   res.setHeader('Content-Type', 'text/event-stream');
  //   res.setHeader('Cache-Control', 'no-cache');
  //   res.setHeader('Connection', 'keep-alive');

  //   this.notificationsService.addClient(clientId, res);

  //   req.on('close', () => {
  //     console.log(`Client ${clientId} disconnected`);
  //     this.notificationsService.removeClient(clientId);
  //     res.end();
  //   });
  // }
}
