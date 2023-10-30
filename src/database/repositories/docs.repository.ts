import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Docs } from '../schemas/docs.schema'


@Injectable()
export class DocsRepository {
    constructor(
        @InjectModel(Docs.name) private readonly docsModel: Model<any>,
    ) { }

    async addDocument(document: any): Promise<any> {
        try {

            const newDoc = await this.docsModel.create(document)
            console.log(newDoc)
            if (!newDoc.id) {
                return { status: 'error', message: 'Error adding document', data: null }
            } else {
                return { status: 'success', message: 'Document added', data: newDoc }
            }
        } catch (error) {
            return { status: 'error', message: 'Error adding document', data: error }
        }
    }

    async getDocument(id): Promise<any> {
        try {
            const document = await this.docsModel.findOne({ id: id }).exec()
            if (document == null) {
                return { status: 'error', message: 'Document not found', data: null }
            } else {
                return { status: 'success', message: 'Document found', data: document }

            }
        } catch (error) {
            return { status: 'error', message: 'Error getting document link', data: error }
        }
    }


}