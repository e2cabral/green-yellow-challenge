import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { parse } from 'papaparse';
import { MetricsService } from '../../../domain/services/metrics/metrics.service';
import { MetricDTO } from '../../dtos/metric.dto';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('metrics'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const metrics = file.buffer.toString();

    const metricsParsed = parse<MetricDTO>(metrics, {
      header: true,
      skipEmptyLines: true,
      transform(value: string, field: string | number): any {
        if (field === 'dateTime') {
          const dateSeparated = value.split('/');
          const timeSeparated = dateSeparated[2].split(' ')[1].split(':');
          dateSeparated[2] = dateSeparated[2].split(' ')[0];

          return new Date(
            Number(dateSeparated[2]),
            Number(dateSeparated[1]) - 1,
            Number(dateSeparated[0]),
            Number(timeSeparated[0]),
            Number(timeSeparated[1]),
            Number(0),
          );
        }
        return value;
      },
    });

    await this.metricsService.createMany(metricsParsed.data);
  }

  @Post('aggregations')
  @HttpCode(HttpStatus.OK)
  async getMetricsAggregated(
    @Body()
    query: {
      metricId: string;
      aggregation: string;
      startDate: string;
      endDate: string;
    },
  ) {
    return this.metricsService.getByAggregationAndDate(
      query.metricId,
      query.aggregation,
      query.startDate,
      query.endDate,
    );
  }
}
