import { AuthService } from './auth.service';
import { CredentialsDTO } from './dtos/credentials-dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.entity';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) credentialsDTO: CredentialsDTO,
  ): Promise<{ token: string }> {
    return this.authService.signIn(credentialsDTO);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    return user;
  }
}
