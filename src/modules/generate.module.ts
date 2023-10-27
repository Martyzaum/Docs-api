import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenerateController } from 'src/controllers/generate.controller';
import { DocsRepository } from 'src/database/repositories/docs.repository';
import { Docs, DocsModel } from 'src/database/schemas/docs.schema';
import { SqsService } from 'src/service/sqs.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Docs.name, schema: DocsModel }]),
    ],
    controllers: [GenerateController],
    providers: [SqsService, DocsRepository],
})
export class GenerateModule { }
