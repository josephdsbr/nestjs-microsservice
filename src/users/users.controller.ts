import { ReturnUserDTOBuilder } from './../models/builders/return-user-dto.builder';
import { ReturnUserDTO } from './../models/dtos/return-user-dto';
import { CreateUserDTO } from './dtos/crete-user-dto';
import { UsersService } from './users.service';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('admin')
  async createAdminUser(
    @Body(ValidationPipe) createUserDTO: CreateUserDTO,
  ): Promise<ReturnUserDTO> {
    const user = await this.usersService.createAdminUser(createUserDTO);
    return ReturnUserDTOBuilder.fromEntity(user);
  }
}
