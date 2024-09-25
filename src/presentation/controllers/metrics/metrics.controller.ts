import {
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
    });

    await this.metricsService.createMany(metricsParsed.data);
  }
}
