import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MemoService } from './memo.service';
import { RequestUpdateMemoNameDto, RequestUpdateMemoDescriptionDto } from './dto/update-memo.dto';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/auth/decorators/user';
import { Memo } from './entities/memo.entity';

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
  findOne(@Param('id') id: string) {
    return this.memoService.findOne(+id);
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
