import {NestFactory} from '@nestjs/core'

import CONFIG, {isProd} from '$config'
import {AppModule} from '$/app.module'

async function main() {
    const app = await NestFactory.create(AppModule)

    // 서버 기본 route는 prefix로 api (only restful에만 적용됨)
    app.setGlobalPrefix(CONFIG.ENDPOINT.GLOBAL_PATH)

    // rest api 관련 cors 설정
    app.enableCors({
        origin: CONFIG.CORS.URL,
        ...(isProd && {credentials: true}),
    })

    await app.listen(4000)
}
main()
