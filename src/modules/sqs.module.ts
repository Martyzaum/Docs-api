import { Module } from '@nestjs/common';
import { SqsService } from 'src/service/sqs.service';

@Module({
  providers: [SqsService],
})
export class SqsModule {}
