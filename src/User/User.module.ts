import { Module } from '@nestjs/common';
import { GetUserProfileService } from './GetUserProfile/GetUserProfile.service';
import { GetUserProfileController } from './GetUserProfile/GetUserProfile.controller';
import { PrismaService } from 'src/Database/prisma.service';
import { CreateUserService } from './CreateUser/CreateUser.service';
import { RefreshUserTokenService } from './RefresfUserToken/RefreshUserToken.service';
import { UserService } from './User/User.service';

@Module({
  exports: [CreateUserService, RefreshUserTokenService, UserService],
  controllers: [GetUserProfileController],
  providers: [
    UserService,
    GetUserProfileService,
    PrismaService,
    CreateUserService,
    RefreshUserTokenService,
  ],
})
export class UserModule {}
