import { ChangePasswordDTO } from './dtos/change-password.dto';
import { Messages } from 'src/messages/messages';
import { UsersService } from './../users/users.service';
import { AuthService } from './auth.service';
import { CredentialsDTO } from './dtos/credentials.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
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
    await this.authService.confirmEmail(token);
    return { message: Messages.USER_EMAIL_CONFIRMED };
  }

  @Post('/send-recover-password')
  async sendRecoverPassword(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    await this.authService.sendRecoverPasswordEmail(email);
    return { message: Messages.MAIL_SEND_WITH_PROPER_INSTRUCTIONS };
  }

  @Patch('/reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body(ValidationPipe) changePasswordDTO: ChangePasswordDTO,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(token, changePasswordDTO);

    return {
      message: Messages.USER_PASSWORD_CHANGED_WITH_SUCCESS,
    };
  }

  @Patch(':id/change-password')
  @UseGuards(AuthGuard())
  async changePassword(
    @Param('id') id: string,
    @Body(ValidationPipe) changePasswordDTO: ChangePasswordDTO,
    @GetUser() user: User,
  ) {
    if (user.role !== UserRole.ADMIN && user.id.toString() !== id)
      throw new UnauthorizedException(Messages.USER_DOES_NOT_HAVE_PERMISSION);

    await this.authService.changePassword(id, changePasswordDTO);
    return {
      message: Messages.USER_PASSWORD_CHANGED_WITH_SUCCESS,
    };
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    return user;
  }
}
