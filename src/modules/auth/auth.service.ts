import { Messages } from './../../messages/messages';
import { CredentialsDTO } from './dtos/credentials-dto';
import { UserRepository } from './../users/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(credentialsDTO: CredentialsDTO): Promise<{ token: string }> {
    const { email, password } = credentialsDTO;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(Messages.USER_EMAIL_DOES_NOT_EXIST);
    }

    const checkedPassword = await user.checkPassword(password);

    if (!checkedPassword) {
      throw new UnauthorizedException(Messages.USER_PASSWORD_DOES_NOT_MATCH);
    }
    const jwtPayload = {
      id: user.id,
    };
    const token = await this.jwtService.sign(jwtPayload);

    return { token };
  }
}
