import { Injectable, NotFoundException } from '@nestjs/common';
import { DecodedIdToken } from "firebase-admin/auth";
import { UserService } from 'src/user/user.service';

@Injectable()
export class DevAuthService {

    constructor(private userService: UserService) { }

    async verifyIdToken(token: string) {
        return {
            uid: 'test',
            email: 'test@gmail.com',
            picture: 'test',
            name: 'test',
        } as unknown as DecodedIdToken;
    }

    async validateUser(token: string): Promise<any> {
        const decodedToken = await this.verifyIdToken(token);

        try {
            const user = await this.userService.findByFirebaseUid(decodedToken.uid);
            return user;
        } catch (error) {
            if (!(error instanceof NotFoundException)) throw error;
            return this.userService.create(token);
        }
    }

}
