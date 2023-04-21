import { Module } from '@nestjs/common';
import { SMSController } from './sms.controller';
import { SMSService } from './sms.service';
import { ConfigService } from '@nestjs/config';
import { AccessStrategy } from '../Auth/Strategies/AccessStrategy/access.strategy';
import { UserModule } from '../User/User.module';

@Module({
  imports: [UserModule],
  controllers: [SMSController],
  providers: [SMSService, ConfigService, AccessStrategy],
})
export class SMSModule {}
