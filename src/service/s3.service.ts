import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
    private s3 = new S3();

    constructor() {
        this.s3 = new S3({
            region: 'us-east-1', 
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.PRIVATE_KEY,
        });
    }

    async saveFile(fileName, fileContent) {
        try {
            const params = {
                Bucket: '',
                Key: fileName,
                Body: fileContent,
            };

            const response = await this.s3.putObject(params).promise();

            return { status: 'success', message: 'Arquivo salvo com sucesso', data: response };

        } catch (error) {
            return { status: 'error', message: error.message }
        }
    }
}
