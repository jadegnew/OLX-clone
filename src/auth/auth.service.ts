import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { UserService } from 'src/user/user.service';
import { hash, compare } from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { TokenPayload } from 'src/interfaces/token.payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '../logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly congifService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async register(userData: UserRegisterDto) {
    try {
      const passwordHash = await hash(
        userData.password,
        +this.congifService.get('SALT'),
      );
      userData.password = passwordHash;
      const createdUser = await this.userService.register(userData);
      this.logger.log(`New user ${createdUser?.email} created.`, 'AuthService');
      return createdUser;
    } catch (error) {
      this.logger.error('Error while creating user', 'AuthService');
      throw new HttpException(
        //TODO make normal exceptions
        'Error while creating user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(userData: UserLoginDto) {
    try {
      const user = await this.userService.getByEmail(userData.email);
      await this.verifyPassword(userData.password, user!.password);
      this.logger.log(`User ${user.email} logged in.`, 'AuthService');
      return user;
    } catch (error) {
      this.logger.error('Error while logining.', 'AuthService');
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAccessToken(userId: number) {
    const iat = Date.now() / 1000;
    const payload: TokenPayload = {
      userId,
      iat,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.congifService.get('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
    this.logger.log(`Access token created for user ${userId}.`, 'AuthService');
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=15m`;
  }

  async getRefreshToken(userId: number) {
    const iat = Date.now() / 1000;
    const payload: TokenPayload = {
      userId,
      iat,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.congifService.get('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    });
    const tokenHash = await hash(token, +this.congifService.get('SALT'));
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=30d`;
    this.logger.log('Refresh token created.', 'AuthService');
    return {
      tokenHash,
      cookie,
    };
  }

  async verifyPassword(password: string, passwordHash: string) {
    const isMatch = await compare(password, passwordHash);
    if (!isMatch) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
