import { AuthService } from './auth.service';
import { CredentialsDTO } from './dtos/credentials-dto';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) credentialsDTO: CredentialsDTO,
  ): Promise<{ token: string }> {
    return this.authService.signIn(credentialsDTO);
  }
}
