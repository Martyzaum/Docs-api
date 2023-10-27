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
            region: 'us-east-1', // Substitua pela região apropriada
            accessKeyId: 'AKIAWGTR4I7M5F46BGWP', // Substitua pela sua chave de acesso
            secretAccessKey: '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', // Substitua pelo seu segredo de acesso
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
                // console.log('Received Message:');
                // console.log('Message ID:', message.MessageId);
                // console.log('Receipt Handle:', message.ReceiptHandle);
                // console.log('Message Body:', message.Body);

                console.log('mensagem recebida')
                const { template, fileName, fields } = JSON.parse(message.Body);
                const docx = await this.docxService.fillDocx(template, fileName, fields)
                console.log('documento preenchido')
                if (docx['status'] == 'error') {
                    return
                }

                console.log('convertendo para pdf')
                const pdf = await this.pdfService.ConvertDocxToPdf(docx);
                console.log(pdf)
                if (pdf['status'] == 'error') {
                    return
                }

                const saveInS3 = await this.s3Service.saveFile(fileName, pdf.data);
                console.log(saveInS3)
                if (saveInS3['status'] == 'error') {
                    return
                }

                const docData = {
                    id: message.MessageId,
                    url: saveInS3.data
                }

                const saveInMongo = await this.docsRepository.addDocument(docData);
                console.log()
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
