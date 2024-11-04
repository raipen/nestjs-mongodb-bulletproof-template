import { Controller, Get, Post, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/decorators/public';
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/user';
import { User } from './entities/user.entity';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  @ApiOperation({
    summary: '회원가입',
    description: `firebase 토큰을 전달받아 회원가입을 진행합니다.\n
      백엔드의 환경변수 중 NODE_ENV가 'test'이거나 'development'인 경우에는 토큰을 검증하지 않고 테스트용 유저를 생성하며,\n
      회원가입을 진행하지 않고 다른 API를 테스트해도 생성되므로 굳이 회원가입을 진행하지 않아도 됩니다.
    `
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiCreatedResponse({ description: '회원가입 성공', type: User })
  signUp(@Headers('authorization') authorization: string) {
    return this.userService.create(authorization);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보 조회', description: '내 정보를 조회합니다.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOkResponse({ description: '내 정보 조회 성공', type: User })
  findOne(@GetUser() user:User) {
    return user;
  }
}
