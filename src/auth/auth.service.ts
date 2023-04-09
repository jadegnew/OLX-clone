import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { UserService } from 'src/user/user.service';
import { hash, compare } from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { TokenPayload } from 'src/interfaces/token.payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly congifService: ConfigService,
  ) {}

  async register(userData: UserRegisterDto) {
    const passwordHash = await hash(
      userData.password,
      +this.congifService.get('SALT'),
    );
    userData.password = passwordHash;
    const createdUser = await this.userService.register(userData);
    return createdUser;
  }

  async login(userData: UserLoginDto) {
    try {
      const user = await this.userService.getByEmail(userData.email);
      await this.verifyPassword(userData.password, user!.password);
      return user;
    } catch (error) {
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
