import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { SqsWorker } from 'src/workers/worker';

@Injectable()
export class WorkerCron {
    constructor(private readonly worker: SqsWorker) {
        cron.schedule('*/5 * * * * *', async () => {
            await this.worker.receiveAndProcessMessage();
        });
    }
}
