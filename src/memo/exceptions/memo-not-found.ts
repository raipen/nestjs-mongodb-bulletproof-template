import { HttpStatus, HttpException } from '@nestjs/common';
import { Types } from 'mongoose';

export class MemoNotFoundException extends HttpException {
  constructor(id: Types.ObjectId) {
    super(`id(${id.toString()})로 만든 메모가 존재하지 않습니다`, HttpStatus.NOT_FOUND);
  }
}
