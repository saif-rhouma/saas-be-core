import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplying } from '../entities/supplying.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SupplyingService {
  constructor(@InjectRepository(Supplying) private repo: Repository<Supplying>) {}

  async createSupplying(stockData) {
    const supplying = this.repo.create(stockData);
  }
}
