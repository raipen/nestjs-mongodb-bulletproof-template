import { ForbiddenException, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Memo } from './entities/memo.entity';
import { RequestUpdateMemoNameDto, RequestUpdateMemoDescriptionDto } from './dto/update-memo.dto';
import { MemoNotFoundException } from './exceptions/memo-not-found';

@Injectable()
export class MemoService {
  constructor(
    @InjectModel(Memo.name) private readonly memoModel: Model<Memo>,
  ) {}

  async create(userId: Types.ObjectId) {
    const memo = await this.memoModel.create({ author: userId });
    return memo.id as string;
  }

  async findAll(userId: Types.ObjectId) {
    const memoList = await this.memoModel.find({ author: userId, deletedAt: null }).exec();
    return memoList.map((memo) => new Memo(memo));
  }

  async findOne(userId: Types.ObjectId, id: Types.ObjectId) {
    const memo = await this.memoModel.findById(id).exec();
    if(!memo) throw new MemoNotFoundException(id);
    if(memo.author.toString() !== userId.toString()) throw new ForbiddenException();
    return new Memo(memo);
  }

  async changeName(
    userId: Types.ObjectId,
    memoId: Types.ObjectId,
    { memo_name }: RequestUpdateMemoNameDto,
  ) {
    const memo = await this.memoModel.findById(memoId).exec();
    if (!memo) {
      throw new MemoNotFoundException(memoId);
    }
    if (memo.author.toString() !== userId.toString()) {
      throw new ForbiddenException();
    }
    memo.memo_name = memo_name;
    await memo.save();
  }

  async changeDesciption(
    userId: Types.ObjectId,
    memoId: Types.ObjectId,
    { memo_description }: RequestUpdateMemoDescriptionDto,
  ) {
    const memo = await this.memoModel.findById(memoId).exec();
    if (!memo) {
      throw new MemoNotFoundException(memoId);
    }
    if (memo.author.toString() !== userId.toString()) {
      throw new ForbiddenException();
    }
    memo.memo_description = memo_description;
    await memo.save();
  }

  async remove(userId: Types.ObjectId, memoId: Types.ObjectId) {
    const memo = await this.memoModel.findById(memoId).exec();
    if (!memo) {
      throw new MemoNotFoundException(memoId);
    }
    if (memo.author.toString() !== userId.toString()) {
      throw new ForbiddenException();
    }
    memo.deletedAt = new Date();
    await memo.save();
  }
}
