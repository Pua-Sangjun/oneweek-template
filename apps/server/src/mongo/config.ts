import {MongooseModuleOptions} from '@nestjs/mongoose'

import CONFIG from '$config'

export const MongoUrl = `${CONFIG.MONGO.URL}:${CONFIG.MONGO.PORT}`

export const MongoOptions: MongooseModuleOptions = {
    dbName: CONFIG.MONGO.NAME,
}
