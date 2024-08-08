/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateApplicationDto } from '../dtos/create-application.dto';
import { ApplicationsService } from '../services/applications.service';
import { GetUser } from 'src/common/decorators/getuser.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { ApplicationDto } from '../dtos/application.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { MSG_EXCEPTION } from 'src/common/constants/messages';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Serialize(ApplicationDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createRole(@Body() applicationData: CreateApplicationDto, @GetUser() user: Partial<User>) {
    return this.applicationsService.createApplication(applicationData, user.id);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findMyApp(@GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    const application = await this.applicationsService.findOne(appId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    return application;
  }

  @Get('/:id')
  async findApplication(@Param('id') id: string) {
    const application = await this.applicationsService.findOne(parseInt(id));
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    return application;
  }

  @Patch()
  async updateApplication(@Body() appData: CreateApplicationDto, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    const application = await this.applicationsService.update(appId, appData);
    return application;
  }

  @Delete('/:id')
  removeApplication(@Param('id') id: string) {
    return this.applicationsService.remove(parseInt(id));
  }
}
