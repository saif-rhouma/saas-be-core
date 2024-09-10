/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from '../entities/application.entity';
import { Repository } from 'typeorm';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application) private repo: Repository<Application>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async createApplication(applicationData: Partial<Application>, userId: number) {
    const application = this.repo.create({ ...applicationData });
    if (!userId) {
      return null;
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    application.owner = user;
    return this.repo.save(application);
  }

  findByName(applicationName: string) {
    return this.repo.find({ where: { name: applicationName } });
  }

  findByOwnerId(ownerId: number) {
    if (!ownerId) {
      return null;
    }
    const application = this.repo.find({ where: { owner: { id: ownerId } } });
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    return application;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const application = this.repo.findOneBy({ id });
    return application;
  }

  async update(id: number, attrs: Partial<Application>) {
    const application = await this.findOne(id);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }

    Object.assign(application, attrs);
    return this.repo.save(application);
  }

  async remove(id: number) {
    const application = await this.findOne(id);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    return this.repo.remove(application);
  }
}
