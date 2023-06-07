import {Module} from '@nestjs/common'
import {RouterModule, Routes} from '@nestjs/core'

import CONFIG from '$config'
import {TempModule} from '$rest/temp'

/**
 * @description nest route 지원을 위한, routes
 * children에 추가 후, Module을 실제로 하단의 RestModule에 삽입해야된다.
 */
const routes: Routes = [
    {
        path: CONFIG.ENDPOINT.RESTFUL,
        children: [{path: TempModule.BASE_API_PATH, module: TempModule}],
    },
]

@Module({
    imports: [TempModule, RouterModule.register(routes)],
})
export class RestModule {}
