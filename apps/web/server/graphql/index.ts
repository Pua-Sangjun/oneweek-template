import {GraphQLModule as GraphQLDefaultModule} from '@nestjs/graphql'
import {Module} from '@nestjs/common'

import {TempModule} from '$graphql/temp'
import {GraphqlOptions} from '$graphql/config'

@Module({
    // TODO : forRootAsync로 변경해야되는 경우 (== async 하게 가져와야 될 config가 있는 경우), 변경해야됨. << graphql options base api도 변경해야됨
    imports: [GraphQLDefaultModule.forRoot(GraphqlOptions), TempModule],
})
export class GraphqlModule {}
