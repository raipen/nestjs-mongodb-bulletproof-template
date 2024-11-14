import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import * as admin from 'firebase-admin';
import { getAuth } from "firebase-admin/auth";
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

jest.mock('firebase-admin', () => {
  return {
    initializeApp: jest.fn(),
    credential: {
      cert: jest.fn(),
    },
  };
});

jest.mock('firebase-admin/auth', () => {
  return {
    getAuth: jest.fn().mockReturnValue({
      verifyIdToken: jest.fn(),
    }),
  };
});


describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {provide: ConfigService, useValue: {get: jest.fn().mockReturnValue('test')}},
        {provide: UserService, useValue: {findByFirebaseUid: jest.fn()}},
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(admin.initializeApp).toHaveBeenCalled();
  });

  it('should verify id token', async () => {
    const token = 'test';
    service.auth.verifyIdToken = jest.fn().mockResolvedValue({});
    await service.verifyIdToken(token);
    expect(service.auth.verifyIdToken).toHaveBeenCalledWith(token);
  });

  test('verifyIdToken이 실패하면 UnauthorizedException을 던진다', async () => {
    service.auth.verifyIdToken = jest.fn().mockRejectedValue(new Error());
    await expect(service.verifyIdToken('test')).rejects.toThrow(UnauthorizedException);
  });

  test('validateUser가 성공하면 user를 반환한다', async () => {
    const token = 'test';
    const user = {id: 1};
    const decodedToken = {uid: 'test'};
    userService.findByFirebaseUid = jest.fn().mockResolvedValue(user);
    service.verifyIdToken = jest.fn().mockResolvedValue(decodedToken);
    const result = await service.validateUser(token);
    expect(result).toBe(user);
  });

  test('verifyIdToken이 실패하면 validateUser도 UnauthorizedException을 던진다', async () => {
    service.auth.verifyIdToken = jest.fn().mockRejectedValue(new Error());
    await expect(service.validateUser('test')).rejects.toThrow(UnauthorizedException);
  });

  test('유저가 없어도 UnauthorizedException을 던진다', async () => {
    const token = 'test';
    const decodedToken = {uid: 'test'};
    userService.findByFirebaseUid = jest.fn().mockRejectedValue(new NotFoundException());
    service.verifyIdToken = jest.fn().mockResolvedValue(decodedToken);
    await expect(service.validateUser(token)).rejects.toThrow(UnauthorizedException);
  });
});
