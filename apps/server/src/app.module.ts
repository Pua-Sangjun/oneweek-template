import {Module} from '@nestjs/common'

import {RestModule} from '$rest'
import {GraphqlModule} from '$graphql'
import {MongoModule} from '$mongo'

@Module({
    imports: [RestModule, GraphqlModule, MongoModule],
})
export class AppModule {}
