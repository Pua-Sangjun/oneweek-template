import {Module} from '@nestjs/common'
import {ConfigModule as NestConfigModule} from '@nestjs/config'

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            // TODO : node env에 따른 env 파일 분기처리 필요
            envFilePath: '.env.local',
        }),
    ],
})
export class ConfigModule {}
