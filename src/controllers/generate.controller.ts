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
            const data = await this.sqsService.sendMessage(JSON.stringify(req.body));
            if (data['status'] == 'error') {
                return res.status(500).json({ status: 'error', message: data['message'] });
            }

            const dataSaved = await this.docsRepository.getDocument(data.id);
            if (dataSaved['status'] == 'error') {
                return res.status(500).json({ status: 'error', message: dataSaved['message'] });
            }

            setTimeout(() => {
                return res.status(200).json({ status: 'success', message: 'sended to queue', data: dataSaved });
            }, 5500);

        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

