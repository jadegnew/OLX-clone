import { Module } from '@nestjs/common';
import { SalePostService } from './sale-post.service';
import { SalePostController } from './sale-post.controller';
import { PrismaService } from 'src/database/prisma.service';
import { AccessStrategy } from 'src/auth/AccessStrategy/access.strategy';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [ConfigModule],
  controllers: [SalePostController],
  providers: [SalePostService, PrismaService, AccessStrategy, UserService],
})
export class SalePostModule {}
