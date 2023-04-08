import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SalePostModule } from './sale-post/sale-post.module';

@Module({
  imports: [UserModule, AuthModule, ConfigModule.forRoot(), SalePostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
