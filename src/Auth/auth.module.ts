import { Module } from '@nestjs/common';
import { GetUserProfileService } from 'src/User/GetUserProfile/GetUserProfile.service';
import { PrismaService } from 'src/Database/prisma.service';
import { LocalStrategy } from './Strategies/LocalStrategy/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccessStrategy } from './Strategies/AccessStrategy/access.strategy';
import { RefreshStrategy } from './Strategies/RefreshStrategy/refresh.strategy';
import { Logger } from '../Logger/Logger.service';
import { CreateUserService } from '../User/CreateUser/CreateUser.service';
import { UserService } from '../User/User/User.service';
import { AuthRegisterController } from './AuthRegister/AuthRegister.controller';
import { AuthLoginController } from './AuthLogin/AuthLogin.controller';
import { AuthManageTokensController } from './AuthManageTokens/AuthManageTokens.controller';
import { RefreshUserTokenService } from '../User/RefresfUserToken/RefreshUserToken.service';
import { AuthLoginService } from './AuthLogin/AuthLogin.service';
import { AuthRegisterService } from './AuthRegister/AuthRegister.service';
import { AuthManageTokensService } from './AuthManageTokens/AuthManageTokens.service';
//TODO add mail / phone verification

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
  controllers: [
    AuthRegisterController,
    AuthLoginController,
    AuthManageTokensController,
  ],
  providers: [
    AuthLoginService,
    AuthRegisterService,
    AuthManageTokensService,
    Logger,
    CreateUserService,
    UserService,
    RefreshUserTokenService,
    GetUserProfileService,
    PrismaService,
    LocalStrategy,
    AccessStrategy,
    RefreshStrategy,
  ],
})
export class AuthModule {}
