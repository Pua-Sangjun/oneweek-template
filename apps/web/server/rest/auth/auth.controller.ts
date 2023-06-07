import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common'
import {Request} from 'express'

import {AuthService} from '$rest/auth/auth.service'
import {AuthDto} from '$rest/auth/dto/auth.dto'
import {CreateUserDto} from '$rest/users/dto/create-user.dto'
import {AccessTokenGuard, RefreshTokenGuard} from '$common/guards/auth.guard'

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.signUp(createUserDto)
    }

    @Post('signin')
    signIn(@Body() data: AuthDto) {
        return this.authService.signIn(data)
    }

    @UseGuards(AccessTokenGuard)
    @Get('logout')
    logout(@Req() req: Request) {
        this.authService.logout(req.user['sub'])
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@Req() req: Request) {
        const userId = req.user['sub']
        const refreshToken = req.user['refreshToken']
        return this.authService.refreshTokens(userId, refreshToken)
    }
}
