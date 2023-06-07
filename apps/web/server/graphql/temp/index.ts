import {Module} from '@nestjs/common'

import {TempService} from './temp.service'
import {TempResolver} from './temp.resolver'

@Module({
    providers: [TempResolver, TempService],
})
export class TempModule {}
