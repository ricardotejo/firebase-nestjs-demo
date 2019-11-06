import { Module } from '@nestjs/common';
import { LoggingService } from './logging/logging.service';

@Module({
    providers: [LoggingService],
})
export class CoreModule { }
