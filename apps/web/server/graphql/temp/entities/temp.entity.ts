import {ObjectType, Field, Int} from '@nestjs/graphql'

@ObjectType()
export class Temp {
    @Field(() => Int, {description: 'Example field (placeholder)'})
    exampleField: number
}
