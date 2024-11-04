import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MemoService } from './memo.service';
import { Types } from 'mongoose';
import { RequestUpdateMemoNameDto, RequestUpdateMemoDescriptionDto } from './dto/update-memo.dto';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/auth/decorators/user';
import { Memo } from './entities/memo.entity';
import { ParseObjectIdPipe } from 'src/common/parse-objectId.pipe';

@Controller('memo')
@ApiTags('Memo')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBearerAuth()
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @Post()
  @ApiOperation({ summary: '메모 생성' })
  @ApiCreatedResponse({ description: '메모 생성', type: String })
  create(@GetUser() user: User) {
    return this.memoService.create(user.id);
  }

  @Get()
  @ApiOperation({ summary: '모든 메모 조회' })
  @ApiOkResponse({ description: '모든 메모 조회', type: [Memo] })
  findAll(@GetUser() user: User) {
    return this.memoService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '메모 조회' })
  @ApiNotFoundResponse({ description: '메모를 찾을 수 없습니다.' })
  @ApiForbiddenResponse({ description: '다른 사용자의 메모는 조회할 수 없습니다.' })
  @ApiOkResponse({ description: '메모 조회', type: Memo })
  @ApiParam({ name: 'id', description: '메모 ID, 16진수 24자리', example: '60f6d2d5e5b4f4001f9b7e0f', type: String })
  findOne(@GetUser() user: User, @Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.memoService.findOne(user.id, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, ) {
    return this.memoService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memoService.remove(+id);
  }
}
