import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetricEntity } from '../../entities/metric.entity';
import { MetricDTO } from '../../../presentation/dtos/metric.dto';
import { Repository } from 'typeorm';

@Injectable()
export class MetricsRepository {
  constructor(
    @InjectRepository(MetricEntity)
    private metricRepository: Repository<MetricEntity>,
  ) {}

  async createMany(metricDto: MetricDTO[]) {
    await this.metricRepository
      .createQueryBuilder()
      .insert()
      .into(MetricEntity)
      .values(metricDto)
      .execute();
  }
}
