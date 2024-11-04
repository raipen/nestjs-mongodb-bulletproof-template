import { Controller, Get, Post, Request, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/decorators/public';

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
}
