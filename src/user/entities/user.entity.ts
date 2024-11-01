import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class User {
    @Prop({ type: String, required: true })
    uid: string;
    
    @Prop({ type: String })
    email: string;
    
    @Prop({ type: String })
    user_name: string;
    
    @Prop({ type: String })
    user_image: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
