import { ReturnUserDTOBuilder } from '../../models/builders/return-user-dto.builder';
import { ReturnUserDTO } from '../../models/dtos/return-user-dto';
import { CreateUserDTO } from './dtos/crete-user-dto';
import { UsersService } from './users.service';
import { Body, Controller, Post, Query, ValidationPipe } from '@nestjs/common';
import { UserRole } from './domain/user-role';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('admin')
  @UseGuards(AuthGuard())
  async createAdminUser(
    @Body(ValidationPipe) createUserDTO: CreateUserDTO,
  ): Promise<ReturnUserDTO> {
    const user = await this.usersService.createUser(
      createUserDTO,
      UserRole.ADMIN,
    );
    return ReturnUserDTOBuilder.fromEntity(user);
  }

  @Post()
  async createUser(
    @Body(ValidationPipe) createUserDTO: CreateUserDTO,
  ): Promise<ReturnUserDTO> {
    const user = await this.usersService.createUser(
      createUserDTO,
      UserRole.USER,
    );
    return ReturnUserDTOBuilder.fromEntity(user);
  }
}
