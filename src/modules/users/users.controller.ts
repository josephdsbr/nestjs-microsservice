import { ReturnUserDTOBuilder } from '../../models/builders/return-user-dto.builder';
import { ReturnUserDTO } from '../../models/dtos/return-user-dto';
import { CreateUserDTO } from './dtos/crete-user-dto';
import { UsersService } from './users.service';
import { Body, Controller, Post, Query, ValidationPipe } from '@nestjs/common';
import { UserRole } from './domain/user-role';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(
    @Body(ValidationPipe) createUserDTO: CreateUserDTO,
    @Query('role') role: UserRole = UserRole.USER,
  ): Promise<ReturnUserDTO> {
    const user = await this.usersService.createUser(createUserDTO, role);
    return ReturnUserDTOBuilder.fromEntity(user);
  }
}
