import { Injectable, Put } from '@nestjs/common';

@Injectable()
export class LoggingService {
    @Put()
    log(log: string) {
        // console.log(log);
    }
}
