import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('metric')
export class MetricEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'metric_id' })
  metricId: string;

  @Column({ name: 'date_time' })
  dateTime: string;

  @Column({ name: 'value' })
  value: string;
}
