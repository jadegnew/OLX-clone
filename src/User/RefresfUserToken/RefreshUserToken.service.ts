import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { PrismaService } from '../../Database/prisma.service';
import { UserService } from '../User/User.service';

@Injectable()
export class RefreshUserTokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async saveRefreshAndIP(userId: number, token: string) {
    try {
      const tokens = await this.prismaService.refreshToken.findMany({
        where: {
          userId,
        },
      });
      if (tokens.length > 9) {
        await this.prismaService.refreshToken.deleteMany({
          where: {
            userId,
          },
        });
      }
      await this.prismaService.refreshToken.create({
        data: {
          userId: userId,
          refreshToken: token,
        },
      });
      await this.prismaService.whitelistIP.create({
        data: {
          userId: userId,
          ip: 'SOME IP', //TODO create ip check
        },
      });
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkRefresh(id: number, tokenFromCookie: string) {
    const user = await this.userService.getById(id);
    const tokens = await this.prismaService.refreshToken.findMany({
      where: {
        userId: user.id,
      },
    });
    let isValid: boolean;
    for (let i = 0; i < tokens.length; i++) {
      isValid = await compare(tokenFromCookie, tokens[i].refreshToken);
      if (isValid) {
        return user;
      }
    }
  }
}
