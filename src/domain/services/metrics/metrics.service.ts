import { Injectable } from '@nestjs/common';
import { MetricsRepository } from '../../../data/repositories/metrics/metrics.repository';
import { MetricDTO } from '../../../presentation/dtos/metric.dto';

@Injectable()
export class MetricsService {
  constructor(private readonly metricsRepository: MetricsRepository) {}
  async createMany(metricsDto: MetricDTO[]) {
    const total = metricsDto.length;
    const itemsPerRoundOfInsert = 100;
    const rounds = Math.ceil(total / itemsPerRoundOfInsert);

    for (let i = 0; i <= rounds; i++) {
      if (i === 0) {
        await this.metricsRepository.createMany(
          metricsDto.slice(i, itemsPerRoundOfInsert),
        );
      } else {
        await this.metricsRepository.createMany(
          metricsDto.slice(
            i * itemsPerRoundOfInsert,
            (i + 1) * itemsPerRoundOfInsert,
          ),
        );
      }
    }
  }
}
