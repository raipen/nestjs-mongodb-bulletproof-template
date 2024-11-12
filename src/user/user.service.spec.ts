import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { DevAuthService } from 'src/auth/auth.service.dev';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockUser = {
  _id: new Types.ObjectId(),
  uid: 'test',
  email: 'test',
  user_name: 'test',
  user_image: 'test',
};

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: AuthService,
          useClass: DevAuthService,
        }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    service.onModuleInit();
    userModel = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('user가 존재하지 않으면, 유저를 생성해야함', async () => {
    userModel.findOne = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    const user = await service.create('token');
    expect(userModel.create).toHaveBeenCalled();
    expect(user).toEqual(new User(mockUser));
  });

  test('user가 존재하면, ConflictException을 던져야함', async () => {
    userModel.findOne = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) });
    await expect(async () => await service.create('token')).rejects.toThrow(ConflictException);
  });

  test('uid로 user를 찾아야함', async () => {
    userModel.findOne = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) });
    const user = await service.findByFirebaseUid('test');
    expect(user).toEqual(new User(mockUser));
  });

  test('user가 존재하지 않으면, NotFoundException을 던져야함', async () => {
    userModel.findOne = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    await expect(async () => await service.findByFirebaseUid('test')).rejects.toThrow(NotFoundException);
  });
});
