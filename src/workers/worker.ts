import { Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { DocsRepository } from 'src/database/repositories/docs.repository';
import { DocxService } from 'src/service/docx.service';
import { PdfService } from 'src/service/pdf.service';
import { S3Service } from 'src/service/s3.service';

@Injectable()
export class SqsWorker {
    private sqs: SQS;
    private queueUrl: string = process.env.SQS_QUEUE_URL;

    constructor(
        private readonly docxService: DocxService,
        private readonly pdfService: PdfService,
        private readonly s3Service: S3Service,
        private readonly docsRepository: DocsRepository,
    ) {
        this.sqs = new SQS({
            region: 'us-east-1',
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.PRIVATE_KEY,
        });
    }

    async receiveAndProcessMessage() {
        const params = {
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 5,
        };

        const response: any = await this.sqs.receiveMessage(params).promise();

        if (response.Messages && response.Messages.length > 0) {
            for (const message of response.Messages) {
                const { template, fileName, fields } = JSON.parse(message.Body);
                const docx = await this.docxService.fillDocx(template, fileName, fields)
                if (docx['status'] == 'error') {
                    return
                }

                const pdf = await this.pdfService.ConvertDocxToPdf(docx);
                if (pdf['status'] == 'error') {
                    return
                }

                const pdfBuffer = Buffer.from(pdf.data, 'base64');
                const saveInS3 = await this.s3Service.saveFile(fileName + '.pdf', pdfBuffer);
                if (saveInS3['status'] == 'error') {
                    return
                }

                const docData = {
                    id: message.MessageId,
                    url: saveInS3.data
                }

                const saveInMongo = await this.docsRepository.addDocument(docData);
                if (saveInMongo['status'] == 'error') {
                    return
                }

                const deleteParams = {
                    QueueUrl: this.queueUrl,
                    ReceiptHandle: message.ReceiptHandle,
                };

                await this.sqs.deleteMessage(deleteParams).promise();
            }
        } else {
            console.log('No messages found in the queue.');
        }
    }
}
