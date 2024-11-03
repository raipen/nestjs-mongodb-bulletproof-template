import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { AuthService } from './auth.service';
import * as admin from 'firebase-admin';
import { Auth, getAuth, DecodedIdToken } from "firebase-admin/auth";
import { UserService } from 'src/user/user.service';

@Injectable()
export class DevAuthService {
    auth: Auth;

    constructor(private userService: UserService) {}

    async verifyIdToken(token: string) {
        return { uid:'test' } as DecodedIdToken;
    }

    async validateUser(token: string): Promise<any> {
        let decodedToken: DecodedIdToken;
        try {
            decodedToken = await this.verifyIdToken(token);
        } catch (error) {
            throw new UnauthorizedException();
        }
        
        try{
            const user = await this.userService.findByFirebaseUid(decodedToken.uid);
            return user;
        }catch (error) {
            if(!(error instanceof NotFoundException)) throw error;
            return this.userService.createForTest();
        }
    }
        
}
