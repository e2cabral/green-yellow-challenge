import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PresentationModule } from './presentation/presentation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataModule } from './data/data.module';
import { MetricEntity } from './data/entities/metric.entity';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [
    PresentationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'green_yellow',
      synchronize: true,
      logging: true,
      entities: [MetricEntity],
    }),
    DataModule,
    DomainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
