export const isProd = process.env.NODE_ENV === 'production'

const CONFIG = {
    // api path config
    ENDPOINT: {
        GLOBAL_PATH: 'api',
        RESTFUL: 'rest',
        GRAPHQL: 'graphql',
        SUBSCRIPTION: 'subscription',
    } as const,
    // mongo db config
    MONGO: {
        URL: process.env.MONGO_URL || 'mongodb://localhost',
        PORT: process.env.MONGO_PORT || 27017,
        NAME: process.env.MONGO_NAME || 'oneweek-template',
    } as const,
    // CORS config
    CORS: {
        URL: process.env.CLIENT_URL || 'http://localhost:5173',
    },
} as const

export default CONFIG
