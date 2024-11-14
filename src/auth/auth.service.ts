import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import * as admin from 'firebase-admin';
import { Auth, getAuth } from "firebase-admin/auth";
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    auth: Auth;

    constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
        const app = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: this.configService.get('FIREBASE_PROJECT_ID',{ infer: true }),
                clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
                privateKey: this.configService.get('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
            }),
        });
        this.auth = getAuth(app);
    }

    async verifyIdToken(token: string) {
        try{
            return await this.auth.verifyIdToken(token);
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    async validateUser(token: string){
        const decodedToken = await this.verifyIdToken(token);
        try {
            const user = await this.userService.findByFirebaseUid(decodedToken.uid);
            return user;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
        
}
