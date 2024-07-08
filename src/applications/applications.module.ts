/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ApplicationsService } from './services/applications.service';

@Module({
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
