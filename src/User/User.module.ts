import { Module } from '@nestjs/common';
import { UserController } from './User/User.controller';
import { PrismaService } from 'src/Database/prisma.service';
import { CreateUserService } from './CreateUser/CreateUser.service';
import { RefreshUserTokenService } from './RefresfUserToken/RefreshUserToken.service';
import { UserService } from './User/User.service';

@Module({
  exports: [CreateUserService, RefreshUserTokenService, UserService],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    CreateUserService,
    RefreshUserTokenService,
  ],
})
export class UserModule {}
