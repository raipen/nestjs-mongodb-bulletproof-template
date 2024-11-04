import { Module } from '@nestjs/common';
import { MemoService } from './memo.service';
import { MemoController } from './memo.controller';
import { Memo, MemoSchema } from './entities/memo.entity';
import { MongooseModuleWithValidation } from 'src/common/mongoose-module-with-validation';

@Module({
  imports: [
    MongooseModuleWithValidation([{ name: Memo.name, schema: MemoSchema }]),
  ],
  controllers: [MemoController],
  providers: [MemoService],
})
export class MemoModule {}
