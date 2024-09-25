import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PresentationModule } from './presentation/presentation.module';
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
    PresentationModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "password",
      database: "green_yellow",
      synchronize: true,
      logging: true,
      entities: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
