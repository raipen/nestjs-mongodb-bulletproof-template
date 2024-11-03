import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class UserService implements OnModuleInit {
  authService: AuthService;
  constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly moduleRef: ModuleRef) {}

  onModuleInit() {
    this.authService = this.moduleRef.get(AuthService, { strict: false });
  }

  async create(token: string) {
    token = token.replace('Bearer ', '');
    
    const firebaseUser = await this.authService.verifyIdToken(token);
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
