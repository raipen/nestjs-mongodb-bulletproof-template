import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  signUp(@Headers('authorization') authorization: string) {
    return this.userService.create(authorization);
  }

  @Get()
  findOne(@Request() req) {
    return req.user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
