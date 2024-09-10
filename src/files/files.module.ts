import { Module } from '@nestjs/common';
import { FilesService } from './services/files.service';
import { FilesController } from './controllers/files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';

@Module({
  imports: [MulterModule.register({ dest: './uploads' }), TypeOrmModule.forFeature([File])],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
