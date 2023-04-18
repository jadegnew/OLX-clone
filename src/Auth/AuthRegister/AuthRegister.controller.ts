import {
  Body,
  Controller,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../../User/CreateUser/CreateUser.dto';
import RequestWithUser from '../../Interfaces/requestWithUser.interface';
import { UserEntity } from '../../User/User/User.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthRegisterService } from './AuthRegister.service';
import { RefreshUserTokenService } from '../../User/RefresfUserToken/RefreshUserToken.service';
import { AuthManageTokensService } from '../AuthManageTokens/AuthManageTokens.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthRegisterController {
  constructor(
    private readonly authRegisterService: AuthRegisterService,
    private readonly authManageTokensService: AuthManageTokensService,
    private readonly refreshUserToken: RefreshUserTokenService,
  ) {}
  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(
    @Body() body: CreateUserDto,
    @Req() req: RequestWithUser,
  ): Promise<string | null> {
    const user = await this.authRegisterService.register(body);
    if (user) {
      const accessToken = await this.authManageTokensService.getAccessToken(
        user.id,
      );
      const refreshToken = await this.authManageTokensService.getRefreshToken(
        user.id,
      );
      await this.refreshUserToken.saveRefreshAndIP(
        user.id,
        refreshToken.tokenHash,
        req.ip,
      );
      req.res?.setHeader('Set-Cookie', [accessToken, refreshToken.cookie]);
      return 'User created.';
    }
    return null;
  }
}
