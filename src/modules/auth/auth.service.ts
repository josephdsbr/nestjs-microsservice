import { Messages } from './../../messages/messages';
import { CredentialsDTO } from './dtos/credentials.dto';
import { UserRepository } from './../users/user.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { IsNull } from 'typeorm';
import { randomBytes } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { ChangePasswordDTO } from './dtos/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailerService: MailerService,
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

  async confirmEmail(confirmationToken: string): Promise<void> {
    const result = await this.userRepository.update(
      { confirmationToken },
      { confirmationToken: null },
    );
    if (result.affected === 0)
      throw new NotFoundException(Messages.USER_INVALID_TOKEN);
  }

  async sendRecoverPasswordEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne(
      { email },
      { where: { removedAt: IsNull() } },
    );

    if (!user) throw new NotFoundException(Messages.USER_NOT_FOUND);

    user.recoverToken = randomBytes(32).toString('hex');
    await user.save();

    const mail = {
      to: user.email,
      from: 'noreply@application.com',
      subject: 'Recuperação de senha',
      template: 'recover-password',
      context: {
        token: user.recoverToken,
      },
    };

    await this.mailerService.sendMail(mail);
  }

  async changePassword(
    id: string,
    changePasswordDTO: ChangePasswordDTO,
  ): Promise<void> {
    const { password, passwordConfirmation } = changePasswordDTO;

    if (password != passwordConfirmation)
      throw new UnprocessableEntityException(
        Messages.USER_PASSWORD_DOES_NOT_MATCH,
      );

    await this.userRepository.changePassword(id, password);
  }

  async resetPassword(
    recoverToken: string,
    changePasswordDTO: ChangePasswordDTO,
  ): Promise<void> {
    const user = await this.userRepository.findOne(
      { recoverToken },
      {
        select: ['id'],
      },
    );
    if (!user) throw new NotFoundException(Messages.USER_INVALID_TOKEN);

    try {
      await this.changePassword(user.id.toString(), changePasswordDTO);
    } catch (error) {
      throw error;
    }
  }
}
