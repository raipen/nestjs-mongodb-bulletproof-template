import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Memo } from './entities/memo.entity';
import { RequestUpdateMemoNameDto, RequestUpdateMemoDescriptionDto } from './dto/update-memo.dto';

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
    const memoList = await this.memoModel.find({ author: userId }).exec();
    return memoList.map((memo) => new Memo(memo));
  }

  findOne(id: number) {
    return `This action returns a #${id} memo`;
  }

  update(id: number) {
    return `This action updates a #${id} memo`;
  }

  remove(id: number) {
    return `This action removes a #${id} memo`;
  }
}
