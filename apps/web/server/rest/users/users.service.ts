import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model} from 'mongoose'

import {User, UserDocument} from '$mongo/schemas/user'
import {UpdateUserDto} from '$rest/users/dto/update-user.dto'
import {CreateUserDto} from '$rest/users/dto/create-user.dto'

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        const createdUser = new this.userModel(createUserDto)
        return createdUser.save()
    }

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().exec()
    }

    async findById(id: string): Promise<UserDocument> {
        return this.userModel.findById(id)
    }

    async findByPhoneNumber(phoneNumber: string): Promise<UserDocument> {
        return this.userModel.findOne({phoneNumber}).exec()
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
        return this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true}).exec()
    }

    // TODO : 정책상, deleted field를 가지고 갈 것인지 확인
    async remove(id: string): Promise<UserDocument> {
        return this.userModel.findByIdAndDelete(id).exec()
    }
}
