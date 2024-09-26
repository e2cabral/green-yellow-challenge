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

  async getByAggregationAndDate(
    metricId: string,
    aggregation: string,
    startDate: string,
    endDate: string,
  ): Promise<{ aggregation: string; value: number }[]> {
    return await this.metricRepository
      .createQueryBuilder('metric')
      .select([
        `DATE_TRUNC('${aggregation}', to_timestamp(metric.date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS')) AS aggregation`,
        'COUNT(metric.value) AS value',
      ])
      .where(
        `to_timestamp(metric.date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS') BETWEEN :startDate AND :endDate`,
        { startDate, endDate },
      )
      .andWhere('metric.metric_id = :metricId', { metricId })
      .groupBy(
        `DATE_TRUNC('${aggregation}', to_timestamp(metric.date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS'))`,
      )
      .orderBy('aggregation', 'ASC')
      .getRawMany();
  }
}
