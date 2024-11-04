import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MemoService } from './memo.service';
import { RequestUpdateMemoNameDto, RequestUpdateMemoDescriptionDto } from './dto/update-memo.dto';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/auth/decorators/user';

@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @Post()
  create(@GetUser() user: User) {
    return this.memoService.create(user.id);
  }

  @Get()
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
