import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RefreshAuthenticationGuard } from '../Strategies/RefreshStrategy/refresh.guard';
import RequestWithUser from '../../Interfaces/requestWithUser.interface';
import { User } from '@prisma/client';
import { AuthManageTokensService } from './AuthManageTokens.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthManageTokensController {
  constructor(
    private readonly AuthManageTokensService: AuthManageTokensService,
  ) {}

  @UseGuards(RefreshAuthenticationGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser): Promise<User> {
    const accessCookie = await this.AuthManageTokensService.getAccessToken(
      request.user.id,
    );
    request.res?.setHeader('Set-Cookie', accessCookie);
    return request.user;
  }
}
