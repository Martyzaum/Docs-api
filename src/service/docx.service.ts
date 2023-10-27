import { Injectable } from '@nestjs/common';
import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

@Injectable()
export class DocxService {

    async fillDocx(template, fileName, fields) {
        try {

            const decodedBase64 = Buffer.from(template, 'base64');
            const templatePath = await join('src', 'storage', 'temp', fileName + '.docx');
            await writeFileSync(templatePath, decodedBase64);

            const content = readFileSync(templatePath, 'binary');

            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, {
                delimiters: { start: "${", end: "}" },
                paragraphLoop: true,
                linebreaks: true,
            });

            const renderJson = {};

            for (const key in fields) {
                renderJson[key] = fields[key];
            }

            doc.render(renderJson);

            const buf = doc.getZip().generate({
                type: 'nodebuffer',
                compression: 'DEFLATE',
            });

            const outputPath = await join('src', 'storage', 'temp', fileName + '-filled' + '.docx');
            await writeFileSync(outputPath, buf);
            await unlinkSync(templatePath);
            return { status: 'success', message: 'Document filled', data: outputPath }
        } catch (error) {
            return { status: 'error', message: error.message }
        }
    }
}
