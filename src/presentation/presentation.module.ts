import { Module } from '@nestjs/common';
import { MetricsController } from './controllers/metrics/metrics.controller';

@Module({
  controllers: [MetricsController]
})
export class PresentationModule {}
