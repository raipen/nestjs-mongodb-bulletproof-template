import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { FirebaseAuthStrategy } from './firebase-auth.stategies';
import { DevAuthService } from './auth.service.dev';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [UserModule],
  providers: [
    FirebaseAuthStrategy,
    {
      provide: AuthService,
      useFactory: (configService, userService) => {
        if(configService.get('env') === 'production') {
          return new AuthService(configService, userService);
        }
        return new DevAuthService(userService);
      },
      inject: [ConfigService, UserService]
    }
  ],
  exports: [AuthService],
})
export class AuthModule { }
