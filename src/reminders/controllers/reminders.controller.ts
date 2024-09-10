import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RemindersService } from '../services/reminders.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CreateReminderDto } from '../dtos/create-reminder.dto';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdateReminderDto } from '../dtos/update-reminder.dto';

@Controller('reminders')
export class RemindersController {
  constructor(private remindersService: RemindersService) {}

  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createRole(@Body() reminderData: CreateReminderDto, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    return this.remindersService.createReminder(reminderData, appId, user.id);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAll(@GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    return this.remindersService.findAllByApplication(appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findCustomer(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    return this.remindersService.findOneByApplication(parseInt(id), appId);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() reminderData: UpdateReminderDto,
    @GetUser() user: Partial<User>,
  ) {
    const appId = parseInt(user.userOwnedApps['id']);
    const customer = await this.remindersService.update(parseInt(id), appId, reminderData);
    return customer;
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  removeCustomer(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    return this.remindersService.remove(parseInt(id), appId);
  }
}
