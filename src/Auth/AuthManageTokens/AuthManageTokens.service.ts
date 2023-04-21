import { Injectable } from '@nestjs/common';
import { TokenPayload } from '../../Interfaces/token.payload.interface';
import { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '../../Logger/Logger.service';

@Injectable()
export class AuthManageTokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}
  async getAccessToken(userId: number, phoneValid: boolean) {
    const iat = Date.now() / 1000;
    const payload: TokenPayload = {
      userId,
      phoneValid,
      iat,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
    this.logger.log(`Access token created for user ${userId}.`, 'AuthService');
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=15m`;
  }

  async getRefreshToken(userId: number, phoneValid: boolean) {
    const iat = Date.now() / 1000;
    const payload: TokenPayload = {
      userId,
      phoneValid,
      iat,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    });
    const tokenHash = await hash(token, +this.configService.get('SALT'));
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=30d`;
    this.logger.log('Refresh token created.', 'AuthService');
    return {
      tokenHash,
      cookie,
    };
  }
}
