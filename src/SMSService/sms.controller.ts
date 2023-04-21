import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SMSService } from './sms.service';
import RequestWithUser from '../Interfaces/requestWithUser.interface';
import { AccessAuthenticationGuard } from '../Auth/Strategies/AccessStrategy/access.guard';
import { VerificationCodeDto } from './DTO/VerificationCode.dto';

@Controller('sms')
export class SMSController {
  constructor(private readonly smsService: SMSService) {}
  @Post('init-verify')
  @UseGuards(AccessAuthenticationGuard)
  async initVerify(@Req() request: RequestWithUser) {
    if (request.user.phoneValid) {
      return 'Phone number already verified';
    }
    await this.smsService.verifyPhoneNumber(request.user.phone);
  }

  @Post('verify')
  @UseGuards(AccessAuthenticationGuard)
  async verify(
    @Req() request: RequestWithUser,
    @Body() verificationCode: VerificationCodeDto,
  ) {
    if (request.user.phoneValid) {
      return 'Phone number already verified';
    }
    await this.smsService.confirmPhoneNumber(
      request.user.id,
      request.user.phone,
      verificationCode.code,
    );
    return 'Phone number verified';
  }
}
