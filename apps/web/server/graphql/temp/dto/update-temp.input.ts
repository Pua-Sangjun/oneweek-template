import {InputType, Field, Int, PartialType} from '@nestjs/graphql'

import {CreateTempInput} from './create-temp.input'

@InputType()
export class UpdateTempInput extends PartialType(CreateTempInput) {
    @Field(() => Int)
    id: number
}
