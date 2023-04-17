import { Module } from '@nestjs/common';
import { SalePostService } from './sale-post.service';
import { SalePostController } from './sale-post.controller';
import { PrismaService } from 'src/Database/prisma.service';
import { AccessStrategy } from 'src/Auth/Strategies/AccessStrategy/access.strategy';
import { ConfigModule } from '@nestjs/config';
import { GetUserProfileService } from 'src/User/GetUserProfile/GetUserProfile.service';
import { Logger } from '../Logger/Logger.service';
import { UserService } from '../User/User/User.service';

@Module({
  imports: [ConfigModule],
  controllers: [SalePostController],
  providers: [
    SalePostService,
    PrismaService,
    AccessStrategy,
    GetUserProfileService,
    Logger,
    UserService,
  ],
})
export class SalePostModule {}
