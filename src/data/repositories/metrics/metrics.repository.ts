import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetricEntity } from '../../entities/metric.entity';
import { Repository } from 'typeorm';
import { MetricDTO } from '../../../presentation/dtos/metric.dto';

@Injectable()
export class MetricsRepository {
  constructor(
    @InjectRepository(MetricEntity)
    private metricRepository: Repository<MetricEntity>,
  ) {}

  async createMany(metricDto: MetricDTO[]) {
    await this.metricRepository.save(metricDto);
  }
}
