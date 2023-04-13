import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { AuthService } from './auth.service';
import { LocalAuthenticationGuard } from './LocalStrategy/localAuth.guard';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';
import { UserService } from 'src/user/user.service';
import { RefreshAuthenticationGuard } from './RefreshStrategy/refresh.guard';
import { UserEntity } from '../user/entities/user.entity';
import { User } from '@prisma/client';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(
    @Body() body: UserRegisterDto,
    @Req() req: RequestWithUser,
  ): Promise<UserEntity | null> {
    const user = await this.authService.register(body);
    if (user) {
      const accessToken = await this.authService.getAccessToken(user.id);
      const refreshToken = await this.authService.getRefreshToken(user.id);
      await this.userService.saveRefreshAndIP(user.id, refreshToken.tokenHash);
      req.res?.setHeader('Set-Cookie', [accessToken, refreshToken.cookie]);
      return user;
    }
    return null;
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(LocalAuthenticationGuard)
  async login(
    @Req() req: RequestWithUser,
    @Body() body: UserLoginDto,
  ): Promise<User> {
    //TODO get IP address and save it in db
    const user = req.user;
    const accessToken = await this.authService.getAccessToken(user.id);
    const refreshToken = await this.authService.getRefreshToken(user.id);
    await this.userService.saveRefreshAndIP(user.id, refreshToken.tokenHash);
    req.res?.setHeader('Set-Cookie', [accessToken, refreshToken.cookie]);
    return user;
  }

  @UseGuards(RefreshAuthenticationGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser): Promise<User> {
    const accessCookie = await this.authService.getAccessToken(request.user.id);
    request.res?.setHeader('Set-Cookie', accessCookie);
    return request.user;
  }
}
