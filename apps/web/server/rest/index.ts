import {Module} from '@nestjs/common'
import {RouterModule, Routes} from '@nestjs/core'

import {AuthModule} from './auth/auth.module'

import {UserModule} from '$rest/users/users.module'

/**
 * @description nest route 지원을 위한, routes
 * children에 추가 후, Module을 실제로 하단의 RestModule에 삽입해야된다.
 */
const routes: Routes = [
    {
        path: '/api/rest',
        children: [
            {path: UserModule.BASE_API_PATH, module: UserModule},
            {path: AuthModule.BASE_API_PATH, module: AuthModule},
        ],
    },
]

@Module({
    imports: [UserModule, AuthModule, RouterModule.register(routes)],
})
export class RestModule {}
