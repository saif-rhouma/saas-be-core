/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { PermissionsService } from '../services/permissions.service';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';

@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Post('/create')
  async createPermission(@Body() permissionData: CreatePermissionDto) {
    return this.permissionsService.create(permissionData);
  }

  @Delete('/:id')
  async removePermission(@Param('id') id: string) {
    return this.permissionsService.remove(parseInt(id));
  }

  @Get('/:id')
  async findPermission(@Param('id') id: string) {
    const permission = await this.permissionsService.findOne(parseInt(id));
    if (!permission) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION);
    }
    return permission;
  }
}
