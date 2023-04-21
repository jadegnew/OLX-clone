import { BadRequestException, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../User/User/User.service';

@Injectable()
export class SMSService {
  private twilioClient: Twilio;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.twilioClient = new Twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  verifyPhoneNumber(phoneNumber: string) {
    const serviceSid = this.configService.get('TWILIO_SERVICE_SID');
    console.log(serviceSid);
    return this.twilioClient.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      });
  }

  async confirmPhoneNumber(userId: number, phoneNumber: string, code: string) {
    const serviceSid = this.configService.get('TWILIO_SERVICE_SID');
    const result = await this.twilioClient.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code,
      });
    if (!result.valid || result.status !== 'approved') {
      throw new BadRequestException('Invalid code');
    }
    await this.userService.markPhoneAsVerified(userId);
  }
}
