import { Module } from '@nestjs/common';
import { MetricsController } from './controllers/metrics/metrics.controller';
import { DomainModule } from '../domain/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [MetricsController],
})
export class PresentationModule {}
