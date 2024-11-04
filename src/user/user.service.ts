import { ConflictException, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class UserService implements OnModuleInit {
  authService: AuthService;
  constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly moduleRef: ModuleRef) {}

  // AuthService를 주입받기 위해 OnModuleInit 인터페이스를 구현
  // AuthService도 UserService에서 사용하기 때문에 모듈이 초기화된 후에 AuthService를 주입받기 위함
  // 생성자로 AuthService를 주입받으면 순환 의존성 문제가 발생할 수 있음
  onModuleInit() {
    this.authService = this.moduleRef.get(AuthService, { strict: false });
  }

  async create(token: string) {
    token = token.replace('Bearer ', '');
    
    const firebaseUser = await this.authService.verifyIdToken(token).catch((e) => {
      throw new UnauthorizedException();
    });
    const user = await this.userModel.findOne({
      uid: firebaseUser.uid,
    }).exec();

    if(user !== null) throw new ConflictException('User already exists');

    return new User(await this.userModel.create({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      user_name: firebaseUser.name,
      user_image: firebaseUser.picture,
    }));
  }

  async findByFirebaseUid(id: string) {
    const user = await this.userModel.findOne({
      uid: id,
    }).exec();

    if(user === null) throw new NotFoundException('User not found');
    return new User(user);
  }
}
