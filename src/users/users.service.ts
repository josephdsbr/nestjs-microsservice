import { CreateUserDTO } from './dtos/crete-user-dto';
import { UserRepository } from './user.repository';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRole } from './domain/user-role';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createAdminUser(createUserDTO: CreateUserDTO): Promise<User> {
    if (createUserDTO.password != createUserDTO.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem.');
    } else {
      return this.userRepository.createUser(createUserDTO, UserRole.ADMIN);
    }
  }
}
