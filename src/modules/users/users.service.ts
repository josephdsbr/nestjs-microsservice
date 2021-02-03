import { UpdateUserDTO } from './dtos/update-user-dto';
import { Messages } from './../../messages/messages';
import { CreateUserDTO } from './dtos/crete-user-dto';
import { UserRepository } from './user.repository';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './domain/user-role';
import { User } from './user.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private mailerService: MailerService,
  ) {}

  async createUser(
    createUserDTO: CreateUserDTO,
    role: UserRole,
  ): Promise<User> {
    if (createUserDTO.password != createUserDTO.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem.');
    } else {
      const user = await this.userRepository.createUser(createUserDTO, role);

      const mail = {
        to: user.email,
        from: 'noreplay@application.com',
        subject: 'Email de Confirmação',
        template: 'email-confirmation',
        context: {
          token: user.confirmationToken,
        },
      };
      await this.mailerService.sendMail(mail);
      return user;
    }
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException(Messages.USER_NOT_FOUND);

    return user;
  }

  async updateUser(updateUserDTO: UpdateUserDTO, id: string): Promise<User> {
    const user = await this.findUserById(id);
    const { name, email, role, status } = updateUserDTO;
    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.role = role ? role : user.role;
    user.status = status === undefined ? status : user.status;

    try {
      await user.save();
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        Messages.DATABASE_PERSISTENCE_ERROR,
      );
    }
  }

  async delete(id: string): Promise<void> {
    const user = await this.findUserById(id);
    user.removedAt = new Date();
    try {
      user.save();
    } catch (err) {
      throw new InternalServerErrorException(
        Messages.DATABASE_PERSISTENCE_ERROR,
      );
    }
  }
}
