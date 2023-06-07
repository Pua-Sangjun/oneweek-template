import {Injectable} from '@nestjs/common'

import {CreateTempInput} from './dto/create-temp.input'
import {UpdateTempInput} from './dto/update-temp.input'

@Injectable()
export class TempService {
    create(createTempInput: CreateTempInput) {
        return 'This action adds a new temp'
    }

    findAll() {
        return `This action returns all temp`
    }

    findOne(id: number) {
        return `This action returns a #${id} temp`
    }

    update(id: number, updateTempInput: UpdateTempInput) {
        return `This action updates a #${id} temp`
    }

    remove(id: number) {
        return `This action removes a #${id} temp`
    }
}
