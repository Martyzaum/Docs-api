import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { exec } from 'child_process';
import { existsSync } from 'fs';
import { readFile } from 'fs';

@Injectable()
export class PdfService {

    async ConvertDocxToPdf(docx) {
        try {
            let checkDocx = 0;
            while (!existsSync(docx.data) || checkDocx > 40) {
                await new Promise((resolve) => setTimeout(resolve, 250));
                checkDocx++;
            }

            const pdf = docx.data.replace('.docx', '.pdf');
            const execPromise = promisify(exec);

            let checkPdf = 0;
            while (!existsSync(pdf) || checkPdf > 5) {
                await execPromise(`doc2pdf ${docx.data}`);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                checkPdf++;
            }

            const pdfBuffer = await promisify(readFile)(pdf);
            const base64Pdf = pdfBuffer.toString('base64');

            return { status: 'success', message: 'Document converted', data: base64Pdf }
        } catch (error) {
            return { status: 'error', message: error.message }
        }
    }
}
