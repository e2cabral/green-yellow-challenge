import { Module } from '@nestjs/common';
import { MetricsRepository } from './repositories/metrics/metrics.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricEntity } from './entities/metric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MetricEntity])],
  providers: [MetricsRepository],
})
export class DataModule {}
