import { CredentialsDTO } from './../auth/dtos/credentials.dto';
import { UserRole } from './domain/user-role';
import { CreateUserDTO } from './dtos/crete-user-dto';
import { User } from './user.entity';
import { EntityRepository, IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    createUserDTO: CreateUserDTO,
    role: UserRole,
  ): Promise<User> {
    const { password } = createUserDTO;
    const user = this.create();
    Object.assign(user, createUserDTO);
    user.role = role;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      return await user.save();
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Endereço de email já está em uso');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados',
        );
      }
    }
  }

  async findByEmail(email: string): Promise<User> {
    return await this.findOne({ email, status: true, removedAt: IsNull() });
  }

  async findById(id: string): Promise<User> {
    return await this.findOne(id, {
      where: {
        removedAt: IsNull(),
      },
    });
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async changePassword(id: string, password: string) {
    const user = await this.findOne(id);
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.recoverToken = null;
    await user.save();
  }
}
