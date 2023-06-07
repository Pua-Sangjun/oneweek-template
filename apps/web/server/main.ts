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

    if (isProd) {
        await app.listen(process.env.SERVER_PORT)
    } else {
        await app.listen(process.env.SERVER_PORT, '0.0.0.0')
    }
}
main()
