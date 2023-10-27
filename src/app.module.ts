import { Module } from '@nestjs/common';
import { SqsModule } from './modules/sqs.module';

import { WorkerModule } from './modules/worker.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GenerateModule } from './modules/generate.module';

@Module({
  imports: [ConfigModule.forRoot(),
  MongooseModule.forRoot(process.env.DATABASE_URL, { dbName: 'docsGen' }),
    GenerateModule, SqsModule, WorkerModule
  ],
})
export class AppModule { }
