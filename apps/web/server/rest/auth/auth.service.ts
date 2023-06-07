import {BadRequestException, ForbiddenException, Injectable} from '@nestjs/common'
import * as argon2 from 'argon2'
import {JwtService} from '@nestjs/jwt'
import {ConfigService} from '@nestjs/config'

import {AuthDto} from '$rest/auth/dto/auth.dto'
import {UserService} from '$rest/users/users.service'
import {CreateUserDto} from '$rest/users/dto/create-user.dto'

type GeneratedToken = {
    accessToken: string
    refreshToken: string
}

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UserService,
        private configService: ConfigService,
    ) {}

    async signUp(createUserDto: CreateUserDto): Promise<GeneratedToken> {
        const userExists = await this.usersService.findByPhoneNumber(createUserDto.phoneNumber)
        if (userExists) {
            throw new BadRequestException('User already exists')
        }

        // Hash password
        const hash = await this.hashData(createUserDto.password)
        const newUser = await this.usersService.create({
            ...createUserDto,
            password: hash,
        })
        const tokens = await this.generateToken(newUser._id, newUser.phoneNumber)
        await this.updateRefreshToken(newUser._id, tokens.refreshToken)
        return tokens
    }

    async signIn(data: AuthDto) {
        // Check if user exists
        const user = await this.usersService.findByPhoneNumber(data.phoneNumber)
        if (!user) {
            throw new BadRequestException('User does not exist')
        }
        const passwordMatches = await argon2.verify(user.password, data.password)
        if (!passwordMatches) {
            throw new BadRequestException('Password is incorrect')
        }
        const tokens = await this.generateToken(user._id, user.phoneNumber)
        await this.updateRefreshToken(user._id, tokens.refreshToken)
        return tokens
    }

    async logout(userId: string) {
        return this.usersService.update(userId, {
            refreshToken: null,
        })
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.usersService.findById(userId)
        if (!user || !user.refreshToken) {
            throw new ForbiddenException('Access Denied')
        }
        const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken)
        if (!refreshTokenMatches) {
            throw new ForbiddenException('Access Denied')
        }
        const tokens = await this.generateToken(user.id, user.phoneNumber)
        await this.updateRefreshToken(user.id, tokens.refreshToken)
        return tokens
    }

    private hashData(data: string) {
        return argon2.hash(data)
    }

    private async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken)
        await this.usersService.update(userId, {
            refreshToken: hashedRefreshToken,
        })
    }

    private async generateToken(userId: string, username: string): Promise<GeneratedToken> {
        const payload = {sub: userId, username} as const
        const accessTokenSignConfig = {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '5m',
        } as const
        const refreshTokenSignConfig = {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '10m',
        } as const
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, accessTokenSignConfig),
            this.jwtService.signAsync(payload, refreshTokenSignConfig),
        ])
        return {
            accessToken,
            refreshToken,
        }
    }
}
