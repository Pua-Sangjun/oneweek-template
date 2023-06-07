import {join} from 'path'

import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo'

import {isProd} from '$config'

export const GraphqlOptions: Readonly<ApolloDriverConfig> = {
    debug: !isProd,
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
    cors: {
        origin: process.env.CLIENT_URL,
        ...(isProd && {credentials: true}),
    },
}
