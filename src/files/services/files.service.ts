import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { File, FileCategory, FileType } from '../entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createReadStream } from 'fs';

@Injectable()
export class FilesService {
  constructor(@InjectRepository(File) private repo: Repository<File>) {}

  getFileByName(fileName: string, res: Response) {
    const filePath = join(process.cwd(), 'public', fileName);
    return res.sendFile(filePath);
  }

  fileStream(fileName) {
    return createReadStream(join(process.cwd(), 'public', fileName));
  }

  async create(fileData: any) {
    const file = this.repo.create(fileData);
    return this.repo.save(file);
  }

  async getAllProductsImages() {
    return this.repo.find({
      where: {
        type: FileType.Image,
        category: FileCategory.Product,
      },
    });
  }
}
