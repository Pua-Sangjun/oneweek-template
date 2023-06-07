import {NestFactory} from '@nestjs/core'

import {AppModule} from './app.module'

import {isProd} from '$config'

async function main() {
    const app = await NestFactory.create(AppModule)

    // rest api 관련 cors 설정
    app.enableCors({
        origin: process.env.CLIENT_URL,
        ...(isProd && {credentials: true}),
    })

    await app.listen(process.env.SERVER_PORT)
}
main()
