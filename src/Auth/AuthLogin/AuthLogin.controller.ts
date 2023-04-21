import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocalAuthenticationGuard } from '../Strategies/LocalStrategy/localAuth.guard';
import RequestWithUser from '../../Interfaces/requestWithUser.interface';
import { UserDto } from '../../User/User/User.dto';
import { User } from '@prisma/client';
import { AuthManageTokensService } from '../AuthManageTokens/AuthManageTokens.service';
import { RefreshUserTokenService } from '../../User/RefresfUserToken/RefreshUserToken.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthLoginController {
  constructor(
    private readonly authManageTokensService: AuthManageTokensService,
    private readonly refreshUserTokenService: RefreshUserTokenService,
  ) {}
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(LocalAuthenticationGuard)
  async login(@Req() req: RequestWithUser): Promise<string> {
    const user = req.user;
    const accessToken = await this.authManageTokensService.getAccessToken(
      user.id,
      user.phoneValid,
    );
    const refreshToken = await this.authManageTokensService.getRefreshToken(
      user.id,
      user.phoneValid,
    );
    await this.refreshUserTokenService.saveRefreshAndIP(
      user.id,
      refreshToken.tokenHash,
      req.ip,
    );
    req.res?.setHeader('Set-Cookie', [accessToken, refreshToken.cookie]);
    return 'Logged in';
  }
}
