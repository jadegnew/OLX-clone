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

  async saveRefreshAndIP(userId: number, token: string, ip: string) {
    try {
      await this.createAndCleanEntity(
        this.prismaService.refreshToken,
        userId,
        9,
        this.prismaService,
        { refreshToken: token },
      );
      await this.createAndCleanEntity(
        this.prismaService.whitelistIP,
        userId,
        9,
        this.prismaService,
        { ip },
      );
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async createAndCleanEntity(
    entityType: any,
    userId: number,
    countLimit: number,
    prismaService: any,
    data: any,
  ) {
    const count = await entityType.count({
      where: {
        userId,
      },
    });
    if (count > countLimit) {
      await entityType.deleteMany({
        where: {
          userId,
        },
      });
    }
    await entityType.create({
      data: {
        userId,
        ...data,
      },
    });
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
