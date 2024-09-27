import { Injectable } from '@nestjs/common';
import { MetricsRepository } from '../../../data/repositories/metrics/metrics.repository';
import { MetricDTO } from '../../../presentation/dtos/metric.dto';
import { unparse } from 'papaparse';

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

  async getByAggregationAndDate(
    metricId: string,
    aggregation: string,
    startDate: string,
    endDate: string,
  ) {
    return (
      await this.metricsRepository.getByAggregationAndDate(
        metricId,
        aggregation,
        startDate,
        endDate,
      )
    ).map(({ aggregation, value }) => ({
      date: new Date(aggregation).toISOString().split('T')[0],
      value,
    }));
  }

  async export(metricId: string, startDate: string, endDate: string) {
    const data = await this.metricsRepository.export(
      metricId,
      startDate,
      endDate,
    );

    return unparse(data, {
      header: true,
    });
  }
}
