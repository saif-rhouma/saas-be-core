import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { ServiceService } from '../services/service.service';
  import { CreateServiceDto } from '../dtos/create-service.dto';
  import { UpdateServiceDto } from '../dtos/update-service.dto';
  import { MSG_EXCEPTION } from 'src/common/constants/messages';
  import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@Controller('orders')
export class ServiceController {
    constructor(
        private serviceService: ServiceService,
        private createServiceDto: CreateServiceDto, 
        private updateServicerDto: UpdateServiceDto, 
    ) {}

    @Get('/:id')
    async findOrder(@Param('id') id: string) {
        const service = await this.serviceService.findOne(parseInt(id));
        if (!service) {
          throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
        }
        return service;
      }

    @Post('/create')
    async createOrder(@Body() serviceData:CreateServiceDto ) {
    return this.serviceService.create(serviceData);
    }

    @Delete('/:id')
    async removeOrder (@Param('id') id: string) {
    return this.serviceService.remove(parseInt(id));
    }

    @Patch()
    async updateUserSelfAccount(@Body() serviceData: UpdateServiceDto) {
      const order = await this.serviceService.update(serviceData.id, serviceData);
      return order;
    }




}
