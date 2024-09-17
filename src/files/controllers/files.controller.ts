/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  Response,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multerOptions from 'src/common/configs/multer.config';
import { FilesService } from '../services/files.service';
import { FileCategory } from '../entities/file.entity';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async handleUpload(@UploadedFile() file: Express.Multer.File, @Body() { category }) {
    if (file) {
      if (!category) category = FileCategory.Product;
      const payload = { name: file.filename, originalName: file.originalname, category };
      const filedata = await this.filesService.create(payload);
      return filedata;
    }
    return 'Nothing Has Been Uploaded!';
  }

  @Get('/products')
  async getAllProductsImages() {
    return this.filesService.getAllProductsImages();
  }

  @Get('/show/:fileName')
  async getFile(@Param('fileName') fileName: string, @Response() res) {
    return this.filesService.getFileByName(fileName, res);
  }

  @Get('/download/:fileName')
  streamable(@Res({ passthrough: true }) response: Response, @Param('fileName') fileName: string) {
    const file = this.filesService.fileStream(fileName);
    return new StreamableFile(file);
  }
}
