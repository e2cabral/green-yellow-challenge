import {Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {parse} from 'papaparse';

@Controller('metrics')
export class MetricsController {
    @Post()
    @UseInterceptors(FileInterceptor('metrics'))
    async upload(@UploadedFile() file: Express.Multer.File) {
        const metrics = file.buffer.toString()
        return parse(metrics, {
            header: true,
            skipEmptyLines: true,
        });
    }
}
