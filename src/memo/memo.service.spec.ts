import { Test, TestingModule } from '@nestjs/testing';
import { MemoService } from './memo.service';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Memo } from './entities/memo.entity';
import { MemoNotFoundException } from './exceptions/memo-not-found';
import { ForbiddenException } from '@nestjs/common';

const mockUser = new User({
  _id: new Types.ObjectId(),
  uid: 'test',
  email: 'test',
  user_name: 'test',
  user_image: 'test',
});

describe('MemoService', () => {
  let service: MemoService;
  let memoModel: Model<Memo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemoService,
        {
          provide: getModelToken(Memo.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            findById: jest.fn()
          },
        },
      ],
    }).compile();

    service = module.get<MemoService>(MemoService);
    memoModel = module.get(getModelToken(Memo.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('memo를 생성해야함', async () => {
    const result = await service.create(mockUser.id);
    expect(memoModel.create).toHaveBeenCalledWith({ author: mockUser.id });
    expect(result).toEqual(mockUser.id);
  });

  test('모든 memo를 찾아야함', async () => {
    const mockMemo = {
      _id: new Types.ObjectId(),
      author: mockUser.id,
      memo_name: 'test',
      memo_description: 'test',
      updatedAt: new Date(),
      deletedAt: null,
    };
    memoModel.find = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockMemo]),
    });
    const result = await service.findAll(mockUser.id);
    expect(result).toEqual([new Memo(mockMemo)]);
  });

  describe('findOne', () => {
    test('특정 memo를 찾아야함', async () => {
      const memoId = new Types.ObjectId();
      const mockMemo = {
        _id: memoId,
        author: mockUser.id,
        memo_name: 'test',
        memo_description: 'test',
        updatedAt: new Date(),
        deletedAt: null,
      };
      memoModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMemo),
      });
      const result = await service.findOne(mockUser.id, memoId);
      expect(result).toEqual(new Memo(mockMemo));
    });

    test('특정 memo가 존재하지 않으면, MemoNotFoundException을 던져야함', async () => {
      const memoId = new Types.ObjectId();
      memoModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(async () => await service.findOne(mockUser.id, memoId)).rejects.toThrow(MemoNotFoundException);
    });

    test('특정 memo가 다른 사용자의 것이면, ForbiddenException을 던져야함', async () => {
      const memoId = new Types.ObjectId();
      const mockMemo = {
        _id: memoId,
        author: new Types.ObjectId(),
        memo_name: 'test',
        memo_description: 'test',
        updatedAt: new Date(),
        deletedAt: null,
        save: jest.fn(),
      };
      memoModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMemo),
      });
      await expect(async () => await service.findOne(mockUser.id, memoId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('changeName', () => {
    test('memo의 이름을 변경해야함', async () => {
      const memoId = new Types.ObjectId();
      const memoData = { memo_name: 'new name' };
      const mockMemo = {
        _id: memoId,
        author: mockUser.id,
        memo_name: 'test',
        memo_description: 'test',
        updatedAt: new Date(),
        deletedAt: null,
        save: jest.fn(),
      };
      memoModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMemo),
      });
      await service.changeName(mockUser.id, memoId, memoData);
      expect(mockMemo.memo_name).toEqual(memoData.memo_name);
      expect(mockMemo.save).toHaveBeenCalled();
    });

    test('특정 memo가 존재하지 않으면, MemoNotFoundException을 던져야함', async () => {
      const memoId = new Types.ObjectId();
      memoModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(async () => await service.changeName(mockUser.id, memoId, { memo_name: 'test' })).rejects.toThrow(MemoNotFoundException);
    });

    test('특정 memo가 다른 사용자의 것이면, ForbiddenException을 던져야함', async () => {
      const memoId = new Types.ObjectId();
      const mockMemo = {
        _id: memoId,
        author: new Types.ObjectId(),
        memo_name: 'test',
        memo_description: 'test',
        updatedAt: new Date(),
        deletedAt: null,
        save: jest.fn(),
      };
      memoModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMemo),
      });
      await expect(async () => await service.changeName(mockUser.id, memoId, { memo_name: 'test' })).rejects.toThrow(ForbiddenException);
    });
  });

  describe('changeDesciption', () => {
    test('memo의 설명을 변경해야함', async () => {
      const memoId = new Types.ObjectId();
      const memoData = { memo_description: 'new description' };
      const mockMemo = {
        _id: memoId,
        author: mockUser.id,
        memo_name: 'test',
        memo_description: 'test',
        updatedAt: new Date(),
        deletedAt: null,
        save: jest.fn(),
      };
      memoModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMemo),
      });
      await service.changeDesciption(mockUser.id, memoId, memoData);
      expect(mockMemo.memo_description).toEqual(memoData.memo_description);
      expect(mockMemo.save).toHaveBeenCalled();
    });

    test('특정 memo가 존재하지 않으면, MemoNotFoundException을 던져야함', async () => {
      const memoId = new Types.ObjectId();
      memoModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(async () => await service.changeDesciption(mockUser.id, memoId, { memo_description: 'test' })).rejects.toThrow(MemoNotFoundException);
    });

    test('특정 memo가 다른 사용자의 것이면, ForbiddenException을 던져야함', async () => {
      const memoId = new Types.ObjectId();
      const mockMemo = {
        _id: memoId,
        author: new Types.ObjectId(),
        memo_name: 'test',
        memo_description: 'test',
        updatedAt: new Date(),
        deletedAt: null,
        save: jest.fn(),
      };
      memoModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMemo),
      });
      await expect(async () => await service.changeDesciption(mockUser.id, memoId, { memo_description: 'test' })).rejects.toThrow(ForbiddenException);
    });
  });

});
