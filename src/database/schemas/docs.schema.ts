import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class Docs {
    @Prop({ index: true, unique: true, expires: 60000 })
    id: string
    @Prop()
    url: string
}

export const DocsModel = SchemaFactory.createForClass(Docs)