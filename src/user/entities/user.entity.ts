import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true, versionKey: false })
export class User {
    @ApiProperty({
        description: 'User ID',
        example: '60f6d2d5e5b4f4001f9b7e0f',
        type: String,
    })
    id: Types.ObjectId;

    @Prop({ type: String, required: true, unique: true })
    @ApiProperty({
        description: 'User UID(from Firebase)',
        example: 'test',
    })
    uid: string;
    
    @Prop({ type: String })
    @ApiProperty({
        description: 'User email',
        example: 'test@test.com',
    })
    email: string;
    
    @Prop({ type: String })
    @ApiProperty({
        description: 'User name',
        example: 'test',
    })
    user_name: string;
    
    @Prop({ type: String })
    @ApiProperty({
        description: 'User image URL',
        example: 'https://test.com/test.jpg',
    })
    user_image: string;

    constructor(partial: Pick<UserDocument, '_id' | keyof User>) {
        this.id = partial._id;
        this.uid = partial.uid;
        this.email = partial.email;
        this.user_name = partial.user_name;
        this.user_image = partial.user_image;
    }
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
