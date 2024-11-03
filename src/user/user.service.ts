import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createForTest() {
    const user = await this.userModel.findOne({
      uid: 'test',
    });
    if(user) throw new ConflictException('User already exist');

    return new User(await this.userModel.create({
      uid: 'test',
      email: 'test@gmail.com',
      user_name: 'test',
      user_image: 'test',
    }));
  }

  async create() {

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
