import {Injectable, Logger, OnModuleInit} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import next from 'next'
import type {NextServer, RequestHandler} from 'next/dist/server/next'

@Injectable()
export class ViewService implements OnModuleInit {
    private nextServer: NextServer

    constructor(private configService: ConfigService) {}

    async onModuleInit(): Promise<void> {
        try {
            const profile = this.configService.get('PROFILE')
            const isLocalProfile = profile === 'local'
            const dir = isLocalProfile ? 'client' : 'dist/client'
            this.nextServer = next({dev: isLocalProfile, dir})
            await this.nextServer.prepare()
        } catch (error) {
            Logger.error(error)
        }
    }

    getNextAppHandler(): RequestHandler {
        return this.nextServer.getRequestHandler()
    }
}
