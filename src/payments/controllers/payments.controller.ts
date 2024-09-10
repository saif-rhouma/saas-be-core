/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdatePaymentDto } from '../dtos/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  //   @Serialize(PlanDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createRole(@Body() paymentData: CreatePaymentDto, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    return this.paymentsService.createPayment(paymentData, user.id, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAll(@GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    const payments = await this.paymentsService.findAllByApplication(appId);
    if (!payments) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PAYMENT);
    }
    return payments;
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findPayment(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    const payment = await this.paymentsService.findOneByApplication(parseInt(id), appId);
    return payment;
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  removePayment(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    return this.paymentsService.remove(parseInt(id), appId);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updatePlan(@Param('id') id: string, @Body() paymentData: UpdatePaymentDto, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    const payment = await this.paymentsService.update(parseInt(id), appId, paymentData);
    return payment;
  }
}
