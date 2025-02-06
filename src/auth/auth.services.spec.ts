import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { HttpException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<User>;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createAuthDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a new user successfully', async () => {
      const hashedPassword = 'hashedPassword';
      const userId = 'someId';
      const token = 'generatedToken';

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({
        id: userId,
        ...createAuthDto,
        password: hashedPassword,
      });
      mockConfigService.get.mockReturnValue('jwt_secret');
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.create(createAuthDto);

      expect(result).toBe(token);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: createAuthDto.email });
      expect(mockUserModel.create).toHaveBeenCalledWith({
        username: createAuthDto.username,
        email: createAuthDto.email,
        password: hashedPassword,
      });
    });

    it('should throw an error if user already exists', async () => {
      mockUserModel.findOne.mockResolvedValue({ email: createAuthDto.email });

      await expect(service.create(createAuthDto)).rejects.toThrow(HttpException);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully with correct credentials', async () => {
      const hashedPassword = 'hashedPassword';
      const userId = 'someId';
      const token = 'generatedToken';
      const user = {
        id: userId,
        email: loginDto.email,
        password: hashedPassword,
      };

      mockUserModel.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(loginDto);

      expect(result).toEqual({ token });
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
    });

    it('should throw an error if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(HttpException);
    });

    it('should throw an error if password is incorrect', async () => {
      mockUserModel.findOne.mockResolvedValue({
        email: loginDto.email,
        password: 'hashedPassword',
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginDto)).rejects.toThrow(HttpException);
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto = {
      email: 'test@example.com',
      newPassword: 'newPassword123',
    };

    it('should reset password successfully', async () => {
      const hashedPassword = 'newHashedPassword';
      const user = {
        email: resetPasswordDto.email,
        password: 'oldPassword',
        save: jest.fn(),
      };

      mockUserModel.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      const result = await service.resetPassword(resetPasswordDto);

      expect(result).toEqual({ message: 'Password successfully updated' });
      expect(user.password).toBe(hashedPassword);
      expect(user.save).toHaveBeenCalled();
    });

    it('should throw an error if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow('User not found');
    });
  });

  describe('getUser', () => {
    it('should return user by id', async () => {
      const userId = 'someId';
      const user = {
        id: userId,
        email: 'test@example.com',
      };

      mockUserModel.findById.mockResolvedValue(user);

      const result = await service.getUser(userId);

      expect(result).toEqual(user);
      expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
    });
  });
});