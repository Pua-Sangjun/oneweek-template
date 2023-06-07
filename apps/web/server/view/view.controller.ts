import {Controller, Get, Res, Req} from '@nestjs/common'
import type {Request, Response} from 'express'

import {ViewService} from './view.service'

@Controller('/')
export class ViewController {
    constructor(private viewService: ViewService) {}

    @Get('*')
    handleNextApp(@Req() req: Request, @Res() res: Response) {
        const handler = this.viewService.getNextAppHandler()
        handler(req, res)
    }
}
