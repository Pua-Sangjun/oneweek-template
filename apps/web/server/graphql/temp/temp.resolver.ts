import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql'

import {TempService} from './temp.service'
import {Temp} from './entities/temp.entity'
import {CreateTempInput} from './dto/create-temp.input'
import {UpdateTempInput} from './dto/update-temp.input'

@Resolver(() => Temp)
export class TempResolver {
    constructor(private readonly tempService: TempService) {}

    @Mutation(() => Temp)
    createTemp(@Args('createTempInput') createTempInput: CreateTempInput) {
        return this.tempService.create(createTempInput)
    }

    @Query(() => [Temp], {name: 'temp'})
    findAll() {
        return this.tempService.findAll()
    }

    @Query(() => Temp, {name: 'temp'})
    findOne(@Args('id', {type: () => Int}) id: number) {
        return this.tempService.findOne(id)
    }

    @Mutation(() => Temp)
    updateTemp(@Args('updateTempInput') updateTempInput: UpdateTempInput) {
        return this.tempService.update(updateTempInput.id, updateTempInput)
    }

    @Mutation(() => Temp)
    removeTemp(@Args('id', {type: () => Int}) id: number) {
        return this.tempService.remove(id)
    }
}
