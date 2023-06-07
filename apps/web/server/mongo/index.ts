import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'

import {MongoUrl, MongoOptions} from '$mongo/config'

/**
 * @descriptions mongoDB를 관리하는 모듈
 *
 * db connection과 schema들을 관리합니다.
 *
 * schema 생성이후, MongooseModule.forFeature를 통해 import는 필수
 */
@Module({
    imports: [MongooseModule.forRoot(MongoUrl, MongoOptions)],
})
export class MongoModule {}
