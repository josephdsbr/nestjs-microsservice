import { Messages } from 'src/messages/messages';
import { UpdateUserDTO } from './dtos/update-user-dto';
import { ReturnUserDTOBuilder } from './../../models/builders/return-user-dto.builder';
import { RolesGuard } from './../../guards/roles-guard';
import { ReturnUserDTO } from '../../models/dtos/return-user-dto';
import { CreateUserDTO } from './dtos/crete-user-dto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserRole } from './domain/user-role';
import { AuthGuard } from '@nestjs/passport';
import Role from 'src/decorators/role.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './user.entity';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('admin')
  @Role(UserRole.ADMIN)
  async createAdmin(
    @Body(ValidationPipe) createUserDTO: CreateUserDTO,
  ): Promise<ReturnUserDTO> {
    const user = await this.usersService.createUser(
      createUserDTO,
      UserRole.ADMIN,
    );
    return ReturnUserDTOBuilder.fromEntity(user);
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  async findUserById(@Param('id') id: string): Promise<ReturnUserDTO> {
    const user = await this.usersService.findUserById(id);
    return ReturnUserDTOBuilder.fromEntity(user);
  }

  @Patch(':id')
  async update(
    @Body(ValidationPipe) updateUserDTO: UpdateUserDTO,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    if (user.role !== UserRole.ADMIN && user.id.toString() != id) {
      throw new ForbiddenException(Messages.FORBIDDEN_ACCESS);
    } else {
      return this.usersService.updateUser(updateUserDTO, id);
    }
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.delete(id);
    return {
      message: 'Usuário removido com sucesso',
    };
  }
}
