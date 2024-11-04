import { ApiProperty, PickType } from '@nestjs/swagger';

class UpdatableMemo {
  @ApiProperty({
    example: '메모 이름',
    description: '메모 이름',
  })
  memo_name: string;

  @ApiProperty({
    example: '메모 내용',
    description: '메모 내용',
  })
  memo_description: string;
}

export class RequestUpdateMemoNameDto extends PickType(UpdatableMemo, [
  'memo_name',
]) {}

export class RequestUpdateMemoDescriptionDto extends PickType(UpdatableMemo, [
  'memo_description',
]) {}
