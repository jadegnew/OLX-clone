import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from 'src/Interfaces/token.payload.interface';
import { RefreshUserTokenService } from '../../../User/RefresfUserToken/RefreshUserToken.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly refreshUserTokenService: RefreshUserTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }
  async validate(request: Request, payload: TokenPayload) {
    const refreshToken: string = request?.cookies?.Refresh;
    return this.refreshUserTokenService.checkRefresh(
      payload.userId,
      refreshToken,
    );
  }
}
