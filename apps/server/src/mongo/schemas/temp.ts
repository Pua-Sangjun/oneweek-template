import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class Temp {
    @Prop({required: true})
    uuid: string

    @Prop({required: true})
    type: 'kakao' | 'apple'

    @Prop({required: true})
    email: string

    @Prop()
    nickname: string

    @Prop({required: false})
    profileImage: string

    @Prop({type: Date, default: Date.now})
    createdAt: Date

    @Prop({type: Date, default: Date.now})
    updatedAt: Date

    @Prop({type: Date, default: Date.now})
    deletedAt: Date
}

export type TempDocument = Temp & Document

export const TempSchema = SchemaFactory.createForClass(Temp)
