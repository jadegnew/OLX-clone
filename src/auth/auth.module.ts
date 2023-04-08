import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/database/prisma.service';
import { LocalStrategy } from './LocalStrategy/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccessStrategy } from './AccessStrategy/access.strategy';
import { RefreshStrategy } from './RefreshStrategy/refresh.strategy';
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
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    LocalStrategy,
    AccessStrategy,
    RefreshStrategy,
  ],
})
export class AuthModule {}
