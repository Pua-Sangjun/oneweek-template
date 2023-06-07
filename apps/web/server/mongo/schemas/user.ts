import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class User {
    @Prop({required: true, unique: true})
    deviceId: string

    @Prop({required: true, unique: true})
    phoneNumber: string

    @Prop()
    password: string

    @Prop({unique: true})
    nickname: string

    @Prop({unique: true, required: false})
    email: string

    @Prop({required: false})
    profileImage: string

    @Prop()
    refreshToken: string

    /**
     * @description 업뎃 날짜
     */
    @Prop({type: Date, default: Date.now})
    createdAt: Date

    @Prop({type: Date, default: Date.now})
    updatedAt: Date

    @Prop({type: Date, default: Date.now})
    deletedAt: Date
}

export type UserDocument = User & Document

export const UserSchema = SchemaFactory.createForClass(User)
