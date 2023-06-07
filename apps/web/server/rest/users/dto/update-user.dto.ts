import {PartialType} from '@nestjs/mapped-types'

import {CreateUserDto} from '$rest/users/dto/create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {}
