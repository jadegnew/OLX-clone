import { Module } from '@nestjs/common';
import { GetUserProfileService } from './GetUserProfile/GetUserProfile.service';
import { GetUserProfileController } from './GetUserProfile/GetUserProfile.controller';
import { PrismaService } from 'src/Database/prisma.service';

@Module({
  controllers: [GetUserProfileController],
  providers: [GetUserProfileService, PrismaService],
})
export class UserModule {}
