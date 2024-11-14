import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DevAuthService } from './auth.service.dev';
import { User } from 'src/user/entities/user.entity';


describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {provide: AuthService, useClass: DevAuthService},
        {provide: UserService, useValue: {
          findByFirebaseUid: jest.fn(),
          create: jest.fn(),
        }},
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('무조건 테스트 디코드 토큰을 반환한다', async () => {
    const result = await service.verifyIdToken('test');
    expect(result).toStrictEqual({
      uid: 'test',
      email: 'test@gmail.com',
      picture: 'test',
      name: 'test',
    });
  });

  test('user가 존재하면 user를 반환한다', async () => {
    const user = {id: 1} as unknown as User;
    userService.findByFirebaseUid = jest.fn().mockResolvedValue(user);
    const result = await service.validateUser('test');
    expect(result).toStrictEqual(user);
  });

  test('user가 존재하지 않으면 user를 생성하고 반환한다', async () => {
    const user = {id: 1} as unknown as User;
    userService.findByFirebaseUid = jest.fn().mockRejectedValue(new NotFoundException());
    userService.create = jest.fn().mockResolvedValue(user);
    const result = await service.validateUser('test');
    expect(result).toStrictEqual(user);
  });
});
