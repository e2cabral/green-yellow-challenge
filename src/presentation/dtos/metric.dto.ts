import { IsNotEmpty } from 'class-validator';

export class MetricDTO {
  @IsNotEmpty() metricId: string;
  @IsNotEmpty() dateTime: string;
  @IsNotEmpty() value: string;
}

export class AggregationsDTO {
  @IsNotEmpty() metricId: string;
  @IsNotEmpty() aggregation: string;
  @IsNotEmpty() startDate: string;
  @IsNotEmpty() endDate: string;
}

export class ExportDTO {
  @IsNotEmpty() metricId: string;
  @IsNotEmpty() startDate: string;
  @IsNotEmpty() endDate: string;
}
