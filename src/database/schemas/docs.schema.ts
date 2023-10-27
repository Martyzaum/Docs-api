import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class Docs {
    @Prop()
    id: string
    @Prop()
    url: string
}

export const DocsModel = SchemaFactory.createForClass(Docs)