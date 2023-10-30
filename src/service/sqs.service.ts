import { Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';

@Injectable()
export class SqsService {
    private sqs = new SQS();
    private queueUrl = process.env.SQS_QUEUE_URL;

    constructor() {
        this.sqs = new SQS({
            region: 'us-east-1', 
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.PRIVATE_KEY,
        });
    }

    async sendMessage(messageBody: string) {
        try {
            const params = {
                QueueUrl: this.queueUrl,
                MessageBody: messageBody,
            };

            const response = await this.sqs.sendMessage(params).promise();
            console.log('response', response)

            return { status: 'success', message: 'sended to queue', id: response.MessageId };
        } catch (error) {
            return { status: 'error', message: error.message }
        }
    }
}
