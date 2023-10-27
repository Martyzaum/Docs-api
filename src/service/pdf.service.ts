import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { exec } from 'child_process';
import { existsSync } from 'fs';
import { readFile } from 'fs';

@Injectable()
export class PdfService {

    async ConvertDocxToPdf(docx) {
        try {
            console.log(1)
            let checkDocx = 0;
            while (!existsSync(docx.data) || checkDocx > 40) {
                await new Promise((resolve) => setTimeout(resolve, 250));
                checkDocx++;
            }
            console.log(2)

            const pdf = docx.data.replace('.docx', '.pdf');
            const execPromise = promisify(exec);

            console.log(3)
            let checkPdf = 0;
            while (!existsSync(pdf) || checkPdf > 5) {
                const { stdout, stderr } = await execPromise(`doc2pdf ${docx.data}`);
                console.log('stdout:', stdout);
                console.log('stderr:', stderr);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                checkPdf++;
            }

            console.log(4)
            const pdfBuffer = await promisify(readFile)(pdf);
            const base64Pdf = pdfBuffer.toString('base64');

            console.log(5)  
            return { status: 'success', message: 'Document converted', data: base64Pdf }
        } catch (error) {
            console.log(error)
            return { status: 'error', message: error.message }
        }
    }
}
