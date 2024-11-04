import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MemoService } from './memo.service';
import { RequestUpdateMemoNameDto, RequestUpdateMemoDescriptionDto } from './dto/update-memo.dto';

@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @Post()
  create() {
    return this.memoService.create();
  }

  @Get()
  findAll() {
    return this.memoService.findAll();
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
