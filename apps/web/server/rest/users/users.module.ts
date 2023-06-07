import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'

import {User, UserSchema} from '$mongo/schemas/user'
import {UserController} from '$rest/users/users.controller'
import {UserService} from '$rest/users/users.service'

@Module({
    imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {
    static readonly BASE_API_PATH = 'users'
}
