import {join} from 'path'

import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo'

import {isProd} from '$config'

export const GraphqlOptions: Readonly<ApolloDriverConfig> = {
    playground: !isProd,
    driver: ApolloDriver,
    path: '/api/graphql',
    autoSchemaFile: join(process.cwd(), '/server/graphql/schema.gql'),
    sortSchema: true,
    subscriptions: {
        'graphql-ws': {
            path: '/api/subscription',
        },
    },
}
