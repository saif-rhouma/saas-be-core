/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateApplicationDto } from '../dtos/create-application.dto';
import { ApplicationsService } from '../services/applications.service';
import { GetUser } from 'src/common/decorators/getuser.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { ApplicationDto } from '../dtos/application.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Serialize(ApplicationDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createRole(@Body() applicationData: CreateApplicationDto, @GetUser() user: Partial<User>) {
    return this.applicationsService.createApplication(applicationData, user.id);
  }
}
