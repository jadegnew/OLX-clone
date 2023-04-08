import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { AuthService } from './auth.service';
import { LocalAuthenticationGuard } from './LocalStrategy/localAuth.guard';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';
import { AccessAuthenticationGuard } from './AccessStrategy/access.guard';
import { UserService } from 'src/user/user.service';
import { RefreshAuthenticationGuard } from './RefreshStrategy/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AccessAuthenticationGuard)
  @Get('test')
  test() {
    console.log('test');
    return 'success';
  }

  @Post('register')
  async register(@Body() body: UserRegisterDto, @Req() req: RequestWithUser) {
    const user = await this.authService.register(body);
    if (user) {
      const accessToken = await this.authService.getAccessToken(user.id);
      const refreshToken = await this.authService.getRefreshToken(user.id);
      await this.userService.saveRefreshAndIP(user.id, refreshToken.token);
      req.res?.setHeader('Set-Cookie', [accessToken, refreshToken.cookie]);
      return user;
    }
    //TODO remake return
    return null;
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser) {
    //TODO get IP address and save it in db
    const user = req.user;
    const accessToken = await this.authService.getAccessToken(user.id);
    const refreshToken = await this.authService.getRefreshToken(user.id);
    await this.userService.saveRefreshAndIP(user.id, refreshToken.token);
    req.res?.setHeader('Set-Cookie', [accessToken, refreshToken.cookie]);
    return user;
  }

  @UseGuards(RefreshAuthenticationGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser) {
    const accessCookie = await this.authService.getAccessToken(request.user.id);
    request.res?.setHeader('Set-Cookie', accessCookie);
    return request.user;
  }
}
