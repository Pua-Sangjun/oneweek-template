import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'

import {AuthController} from '$rest/auth/auth.controller'
import {AuthService} from '$rest/auth/auth.service'
import {AccessTokenStrategy, RefreshTokenStrategy} from '$rest/auth/strategies'
import {UserModule} from '$rest/users/users.module'

@Module({
    imports: [JwtModule.register({}), UserModule],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {
    static readonly BASE_API_PATH = 'auth'
}
