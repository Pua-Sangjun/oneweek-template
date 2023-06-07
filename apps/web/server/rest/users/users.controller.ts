import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common'

import {UpdateUserDto} from '$rest/users/dto/update-user.dto'
import {CreateUserDto} from '$rest/users/dto/create-user.dto'
import {UserService} from '$rest/users/users.service'
import {AccessTokenGuard} from '$common/guards/auth.guard'

@Controller()
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Get('test')
    test() {
        return {test: '123'}
    }

    @UseGuards(AccessTokenGuard)
    @Get()
    findAll() {
        return this.usersService.findAll()
    }

    @UseGuards(AccessTokenGuard)
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.usersService.findById(id)
    }

    @UseGuards(AccessTokenGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto)
    }

    @UseGuards(AccessTokenGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id)
    }
}
