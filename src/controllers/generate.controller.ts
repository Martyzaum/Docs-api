import { Controller, Post, Req, Res } from '@nestjs/common';
import { SqsService } from 'src/service/sqs.service';
import { Response, Request } from 'express';
import { DocsRepository } from 'src/database/repositories/docs.repository';

@Controller('generate')
export class GenerateController {

    constructor(private readonly sqsService: SqsService,
        private readonly docsRepository: DocsRepository) { }

    @Post('doc-in-pdf')
    async generateDocInPdf(@Req() req: Request, @Res() res: Response) {
        try {
            const sqs = await this.sqsService.sendMessage(JSON.stringify(req.body));
            if (sqs['status'] == 'error') {
                return res.status(500).json({ status: 'error', message: sqs['message'] });
            }

            let dataSaved = {
                data : null
            }

            let tries = 0;
            while (dataSaved.data == null) {
                dataSaved = await this.docsRepository.getDocument(sqs.id);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            if (dataSaved['status'] == 'error') {
                return res.status(500).json({ status: 'error', message: dataSaved['message'] });
            }

            return res.status(200).json({ status: 'success', message: 'sended to queue', data: dataSaved })
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

