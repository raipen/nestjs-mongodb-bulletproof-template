import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Types } from 'mongoose';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call UserService.create', async () => {
    const authorization = 'Bearer token';
    await controller.signUp(authorization);
    expect(userService.create).toHaveBeenCalledWith(authorization);
  });

  it('should return user', () => {
    const user = new User({
      _id: new Types.ObjectId(),
      uid: 'test',
      email: 'test',
      user_name: 'test',
      user_image: 'test',
    });
    expect(controller.findOne(user)).toBe(user);
  });
});
