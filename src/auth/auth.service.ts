import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import * as admin from 'firebase-admin';
import { Auth, getAuth, DecodedIdToken } from "firebase-admin/auth";
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
        return this.auth.verifyIdToken(token);
    }

    async validateUser(token: string){
        try {
            const decodedToken = await this.verifyIdToken(token);
            const user = await this.userService.findByFirebaseUid(decodedToken.uid);
            return user;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
        
}
