import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseAuthGuard } from './auth/firebase-auth.guard';
import { MemoModule } from './memo/memo.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database.url'),
        dbName: configService.get('database.dbName'),
        user: configService.get('database.username'),
        pass: configService.get('database.password'),
      }),
    }),
    AuthModule,
    UserModule,
    MemoModule
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: FirebaseAuthGuard
  }],
})
export class AppModule {}
