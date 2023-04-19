import { Module } from '@nestjs/common';
import { UserModule } from './User/User.module';
import { AuthModule } from './Auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SalePostModule } from './Sale-post/sale-post.module';
import { SearchModule } from './Search/Search.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot(),
    SalePostModule,
    SearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
