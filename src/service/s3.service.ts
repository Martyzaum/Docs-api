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
                Bucket: 'docs-worker',
                Key: fileName,
                Body: fileContent,
                ACL: 'public-read',
            };

            //insert on s3 and return the public link
            const response = await this.s3.upload(params).promise();
            return { status: 'success', message: 'File saved', data: response.Location };

        } catch (error) {
            console.log(error)
            return { status: 'error', message: error.message }
        }
    }
}
