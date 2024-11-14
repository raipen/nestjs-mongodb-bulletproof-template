import { Test, TestingModule } from '@nestjs/testing';
import { MemoController } from './memo.controller';
import { MemoService } from './memo.service';
import { Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

const mockUser = new User({
  _id: new Types.ObjectId(),
  uid: 'test',
  email: 'test',
  user_name: 'test',
  user_image: 'test',
});

describe('MemoController', () => {
  let controller: MemoController;
  let memoService: MemoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemoController],
      providers: [{
        provide: MemoService,
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          findOne: jest.fn(),
          changeName: jest.fn(),
          changeDesciption: jest.fn(),
          remove: jest.fn(),
        },
      }],
    }).compile();

    controller = module.get<MemoController>(MemoController);
    memoService = module.get<MemoService>(MemoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('should call MemoService.create', async () => {
    await controller.create(mockUser);
    expect(memoService.create).toHaveBeenCalledWith(mockUser.id);
  });

  test('should call MemoService.findAll', async () => {
    await controller.findAll(mockUser);
    expect(memoService.findAll).toHaveBeenCalledWith(mockUser.id);
  });

  test('should call MemoService.findOne', async () => {
    const memoId = new Types.ObjectId();
    await controller.findOne(mockUser, memoId);
    expect(memoService.findOne).toHaveBeenCalledWith(mockUser.id, memoId);
  });

  test('should call MemoService.changeName', async () => {
    const memoId = new Types.ObjectId();
    const memoData = { memo_name: 'test' };
    await controller.changeName(mockUser, memoId, memoData);
    expect(memoService.changeName).toHaveBeenCalledWith(mockUser.id, memoId, memoData);
  });

  test('should call MemoService.changeDesciption', async () => {
    const memoId = new Types.ObjectId();
    const memoData = { memo_description: 'test' };
    await controller.changeDesciption(mockUser, memoId, memoData);
    expect(memoService.changeDesciption).toHaveBeenCalledWith(mockUser.id, memoId, memoData);
  });

  test('should call MemoService.remove', async () => {
    const memoId = new Types.ObjectId();
    await controller.remove(mockUser, memoId);
    expect(memoService.remove).toHaveBeenCalledWith(mockUser.id, memoId);
  });
});
