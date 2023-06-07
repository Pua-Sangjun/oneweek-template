import {Module} from '@nestjs/common'

import {ConfigModule} from '$config'
import {MongoModule} from '$mongo'
import {RestModule} from '$rest'
import {GraphqlModule} from '$graphql'
import {ViewModule} from '$view/view.module'

@Module({
    imports: [
        ConfigModule, // global config를 제공하는 module
        MongoModule, // mongo db mount
        GraphqlModule, // graphql api module (/api/graphql)
        RestModule, // rest api module (/api/rest)
        ViewModule, // 다 api 거치고 오면, next로 넘김 (static은 nginx에서 serving)
    ],
})
export class AppModule {}
