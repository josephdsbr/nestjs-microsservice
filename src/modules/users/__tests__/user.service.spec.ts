import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { UsersService } from '../users.service';
import { CreateUserDTO } from '../dtos/crete-user-dto';
import { UserRole } from '../domain/user-role';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

const mockUserRepository = () => ({
  createUser: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  findUsers: jest.fn(),
  findById: jest.fn(),
});

const mailerMock = () => ({
  sendMail: jest.fn(),
});

describe('UsersServices', () => {
  let service;
  let userRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: MailerService,
          useFactory: mailerMock,
        },
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    let mockCreateUserDto: CreateUserDTO;

    beforeEach(() => {
      mockCreateUserDto = {
        email: 'mock@email.com',
        name: 'Mock User',
        password: 'mockPassword',
        passwordConfirmation: 'mockPassword',
      };
    });

    it('should create an user if passwords match', async () => {
      userRepository.createUser.mockResolvedValue('mockUser');
      const result = await service.createUser(
        mockCreateUserDto,
        UserRole.ADMIN,
      );

      expect(userRepository.createUser).toHaveBeenCalledWith(
        mockCreateUserDto,
        UserRole.ADMIN,
      );
      expect(result).toEqual('mockUser');
    });

    it('should throw an error if passwords doesnt match', async () => {
      mockCreateUserDto.passwordConfirmation = 'wrongPassword';
      expect(
        service.createUser(mockCreateUserDto, UserRole.ADMIN),
      ).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('findUserById', () => {
    it('should return the found user', async () => {
      userRepository.findById.mockResolvedValue('mockUser');
      expect(userRepository.findById).not.toHaveBeenCalled();

      const result = await service.findUserById('mockId');
      expect(userRepository.findById).toHaveBeenCalledWith('mockId');
      expect(result).toEqual('mockUser');
    });

    it('should throw an error as user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(service.findUserById('mockId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should throw an error if no user is deleted', async () => {
      userRepository.delete.mockResolvedValue({ affected: 0 });
      expect(service.delete('mockId')).rejects.toThrow(NotFoundException);
    });
  });
});
