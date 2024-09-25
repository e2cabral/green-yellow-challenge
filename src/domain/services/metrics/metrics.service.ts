import { Injectable } from '@nestjs/common';
import { MetricsRepository } from '../../../data/repositories/metrics/metrics.repository';
import { MetricDTO } from '../../../presentation/dtos/metric.dto';

@Injectable()
export class MetricsService {
  constructor(private readonly metricsRepository: MetricsRepository) {}
  async createMany(metricsDto: MetricDTO[]) {
    await this.metricsRepository.createMany(metricsDto);
  }
}
