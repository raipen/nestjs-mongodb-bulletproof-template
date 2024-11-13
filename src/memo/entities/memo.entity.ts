import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, HydratedDocument } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

export type MemoDocument = HydratedDocument<Memo>;
@Schema({ timestamps: true, versionKey: false })
export class Memo {
  @ApiProperty({
    description: 'User ID',
    example: '60f6d2d5e5b4f4001f9b7e0f',
    type: String,
  })
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  id: Types.ObjectId;

  @Prop({ type: String, default: null })
  @ApiProperty({
    description: 'Memo Name',
    example: '메모 이름',
  })
  memo_name: string;

  @Prop({ type: String, default: null })
  @ApiProperty({
    description: 'Memo Description',
    example: '메모 내용',
  })
  memo_description: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @Exclude()
  author: Types.ObjectId;

  @Prop({ type: Date, default: null })
  @Exclude()
  deletedAt: Date;

  @ApiProperty({
    description: 'updated date',
    example: '2021-07-21T13:00:00.000Z',
  })
  updatedAt: Date;

  constructor(partial: Pick<MemoDocument, '_id' | Exclude<keyof Memo, 'id'>>) {
    this.id = partial._id;
    this.memo_name = partial.memo_name;
    this.memo_description = partial.memo_description;
    this.author = partial.author;
    this.updatedAt = partial.updatedAt;
  }
}

export const MemoSchema = SchemaFactory.createForClass(Memo);
