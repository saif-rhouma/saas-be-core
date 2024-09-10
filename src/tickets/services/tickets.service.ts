/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from '../entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { TicketMessagesService } from './ticket-messages.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private repo: Repository<Ticket>,
    private usersService: UsersService,
    private applicationsService: ApplicationsService,
    @Inject(forwardRef(() => TicketMessagesService))
    private ticketMessagesService: TicketMessagesService,
  ) {}

  async createTicket(ticketData: CreateTicketDto, applicationId: number, userId: number) {
    if (!userId || !applicationId) {
      return null;
    }
    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }

    const member = await this.usersService.findOne(ticketData.memberId);
    const preTicket = new Ticket();

    preTicket.member = member;
    preTicket.application = application;
    preTicket.createdBy = user;
    preTicket.description = ticketData.description;
    preTicket.topic = ticketData.topic;
    preTicket.priority = ticketData.priority;
    preTicket.file = ticketData.file;

    const ticket = this.repo.create({ ...preTicket });

    return this.repo.save(ticket);
  }

  findAllByApplication(appId: number) {
    if (!appId) {
      return null;
    }
    const ticket = this.repo.find({
      where: { application: { id: appId } },
      relations: { member: true, messages: true, createdBy: true },
    });
    if (!ticket) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_TICKET);
    }
    return ticket;
  }

  async findOneByApplication(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const ticket = await this.repo.findOne({
      where: { id, application: { id: appId } },
      relations: { member: true, messages: { createdBy: true }, createdBy: true },
    });
    if (!ticket) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_TICKET);
    }
    return ticket;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const ticket = this.repo.findOneBy({ id });
    return ticket;
  }

  async update(id: number, appId: number, attrs: Partial<Ticket>) {
    const ticket = await this.findOneByApplication(id, appId);
    Object.assign(ticket, attrs);
    return this.repo.save(ticket);
  }

  async remove(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }

    const ticket = await this.findOneByApplication(id, appId);
    if (ticket.messages.length) {
      await this.ticketMessagesService.removeAllByTicket(ticket.id);
    }
    if (!ticket) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_TICKET);
    }
    return this.repo.remove(ticket);
  }

  async analytics(appId: number) {
    if (!appId) {
      return null;
    }
    const analytics = await this.repo.manager.query(
      `select SUM(CASE WHEN status = '${TicketStatus.Open}' THEN 1 ELSE 0 END) As Open,
      SUM(CASE WHEN status = '${TicketStatus.Closed}' THEN 1 ELSE 0 END) AS Closed,
      COUNT(*) AS Count from 'ticket'
      where applicationId = ${appId};`,
    );

    return { analytics: analytics[0] };
  }
}
