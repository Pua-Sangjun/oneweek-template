import {MongooseModuleOptions} from '@nestjs/mongoose'

const {MONGO_URL: mongoBaseUrl, MONGO_PORT: mongoPort, MONGO_NAME: dbName} = process.env

export const MongoUrl = `${mongoBaseUrl}:${mongoPort}` as const

export const MongoOptions: MongooseModuleOptions = {dbName} as const
