import { Module } from '@nestjs/common';
import { MetricsService } from './services/metrics/metrics.service';
import { DataModule } from '../data/data.module';

@Module({
  imports: [DataModule],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class DomainModule {}
