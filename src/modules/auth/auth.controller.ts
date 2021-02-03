import { Messages } from 'src/messages/messages';
import { UsersService } from './../users/users.service';
import { AuthService } from './auth.service';
import { CredentialsDTO } from './dtos/credentials-dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { CreateUserDTO } from '../users/dtos/crete-user-dto';
import { ReturnUserDTO } from 'src/models/dtos/return-user-dto';
import { UserRole } from '../users/domain/user-role';
import { ReturnUserDTOBuilder } from 'src/models/builders/return-user-dto.builder';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) credentialsDTO: CredentialsDTO,
  ): Promise<{ token: string }> {
    return this.authService.signIn(credentialsDTO);
  }

  @Post('/signup')
  async createUser(
    @Body(ValidationPipe) createUserDTO: CreateUserDTO,
  ): Promise<ReturnUserDTO> {
    const user = await this.userService.createUser(
      createUserDTO,
      UserRole.USER,
    );
    return ReturnUserDTOBuilder.fromEntity(user);
  }

  @Patch(':token')
  async confirmEmail(@Param('token') token: string) {
    const user = await this.authService.confirmEmail(token);
    return { message: Messages.USER_EMAIL_CONFIRMED };
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    return user;
  }
}
