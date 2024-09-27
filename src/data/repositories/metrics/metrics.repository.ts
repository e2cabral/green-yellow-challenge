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

  async export(metricId: string, startDate: string, endDate: string) {
    const promiseAggregateByDay = this.getAggregateByDay(
      startDate,
      endDate,
      metricId,
    );
    const promiseAggregateByMonth = this.getAggregateByMonth(
      startDate,
      endDate,
      metricId,
    );
    const promiseAggregateByYear = this.getAggregateByYear(
      startDate,
      endDate,
      metricId,
    );

    const [dailyAggregation, monthlyAggregation, yearlyAggregation] =
      await Promise.all([
        promiseAggregateByDay,
        promiseAggregateByMonth,
        promiseAggregateByYear,
      ]);

    return dailyAggregation.map((daily) => {
      const date = new Date(daily.aggregation);

      const month = this.findAggregation(monthlyAggregation, date, 1);
      const year = this.findAggregation(yearlyAggregation, date, 0);

      return {
        MetricId: daily.metricid,
        DateTime: daily?.aggregation.toISOString().split('T')[0],
        AggDay: daily.day_count,
        AggMonth: month?.month_count,
        AggYear: year?.year_count,
      };
    });
  }

  findAggregation(aggregation: any[], dateToCompare: Date, index: number) {
    return aggregation.find((y) => {
      const fromAggregate = y.aggregation.toISOString().split('-')[index];
      const fromDayAggregate = dateToCompare.toISOString().split('-')[index];

      return fromAggregate === fromDayAggregate;
    });
  }

  async getAggregateByDay(
    startDate: string,
    endDate: string,
    metricId: string,
  ) {
    return await this.metricRepository
      .createQueryBuilder('metric')
      .select([
        'metric.metric_id AS metricId',
        `DATE_TRUNC('day', to_timestamp(metric.date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS')) AS aggregation`,
        "COUNT(DISTINCT DATE_TRUNC('day', to_timestamp(metric.date_time, 'YYYY-MM-DD\"T\"HH24:MI:SS.MS'))) AS day_count",
      ])
      .where(
        `to_timestamp(metric.date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS') BETWEEN :startDate AND :endDate`,
        { startDate, endDate },
      )
      .andWhere('metric.metric_id = :metricId', { metricId })
      .groupBy('metric.metric_id, aggregation')
      .orderBy('aggregation', 'ASC')
      .getRawMany();
  }

  async getAggregateByYear(
    startDate: string,
    endDate: string,
    metricId: string,
  ) {
    return await this.metricRepository
      .createQueryBuilder('metric')
      .select([
        `DATE_TRUNC('year', to_timestamp(metric.date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS')) AS aggregation`,
        "COUNT(DISTINCT DATE_TRUNC('day', to_timestamp(metric.date_time, 'YYYY-MM-DD\"T\"HH24:MI:SS.MS'))) AS year_count",
      ])
      .where(
        `to_timestamp(metric.date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS') BETWEEN :startDate AND :endDate`,
        { startDate, endDate },
      )
      .andWhere('metric.metric_id = :metricId', { metricId })
      .groupBy('aggregation')
      .orderBy('aggregation', 'ASC')
      .getRawMany();
  }

  async getAggregateByMonth(
    startDate: string,
    endDate: string,
    metricId: string,
  ) {
    return await this.metricRepository
      .createQueryBuilder('metric')
      .select([
        `DATE_TRUNC('month', to_timestamp(metric.date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS')) AS aggregation`, // Agregação por mês
        "COUNT(DISTINCT DATE_TRUNC('day', to_timestamp(metric.date_time, 'YYYY-MM-DD\"T\"HH24:MI:SS.MS'))) AS month_count", // Contagem de dias distintos no mês
      ])
      .where(
        `to_timestamp(metric.date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS') BETWEEN :startDate AND :endDate`,
        { startDate, endDate },
      )
      .andWhere('metric.metric_id = :metricId', { metricId })
      .groupBy('aggregation')
      .orderBy('aggregation', 'ASC')
      .getRawMany();
  }
}
