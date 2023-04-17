import { Module } from '@nestjs/common';
import { SalePostService } from './sale-post.service';
import { SalePostController } from './sale-post.controller';
import { PrismaService } from 'src/Database/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { Logger } from '../Logger/Logger.service';
import { UserService } from '../User/User/User.service';
import { AuthModule } from '../Auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [SalePostController],
  providers: [SalePostService, PrismaService, Logger, UserService],
})
export class SalePostModule {}
