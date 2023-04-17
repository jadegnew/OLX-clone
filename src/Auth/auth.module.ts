import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Database/prisma.service';
import { LocalStrategy } from './Strategies/LocalStrategy/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccessStrategy } from './Strategies/AccessStrategy/access.strategy';
import { RefreshStrategy } from './Strategies/RefreshStrategy/refresh.strategy';
import { Logger } from '../Logger/Logger.service';
import { AuthRegisterController } from './AuthRegister/AuthRegister.controller';
import { AuthLoginController } from './AuthLogin/AuthLogin.controller';
import { AuthManageTokensController } from './AuthManageTokens/AuthManageTokens.controller';
import { AuthLoginService } from './AuthLogin/AuthLogin.service';
import { AuthRegisterService } from './AuthRegister/AuthRegister.service';
import { AuthManageTokensService } from './AuthManageTokens/AuthManageTokens.service';
import { UserModule } from '../User/User.module';
//TODO add mail / phone verification

@Module({
  imports: [
    UserModule,
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
  exports: [AccessStrategy],
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
    PrismaService,
    LocalStrategy,
    AccessStrategy,
    RefreshStrategy,
  ],
})
export class AuthModule {}
