import {join} from 'path'

import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo'

import CONFIG, {isProd} from '$config'

export const GraphqlOptions: Readonly<ApolloDriverConfig> = {
    debug: !isProd,
    playground: !isProd,
    driver: ApolloDriver,
    path: `/${CONFIG.ENDPOINT.GLOBAL_PATH}/${CONFIG.ENDPOINT.GRAPHQL}`,
    autoSchemaFile: join(process.cwd(), '/src/graphql/schema.gql'),
    sortSchema: true,
    subscriptions: {
        'graphql-ws': {
            path: CONFIG.ENDPOINT.SUBSCRIPTION,
        },
    },
    cors: {
        origin: CONFIG.CORS.URL,
        ...(isProd && {credentials: true}),
    },
}
