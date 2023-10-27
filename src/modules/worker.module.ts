import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerCron } from 'src/crons/wroker.cron';
import { DocsRepository } from 'src/database/repositories/docs.repository';
import { Docs, DocsModel } from 'src/database/schemas/docs.schema';
import { DocxService } from 'src/service/docx.service';
import { PdfService } from 'src/service/pdf.service';
import { S3Service } from 'src/service/s3.service';
import { SqsWorker } from 'src/workers/worker';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Docs.name, schema: DocsModel }]),
    ],
    providers: [SqsWorker, WorkerCron, DocxService, PdfService, S3Service, DocsRepository],
})
export class WorkerModule { }
