import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { UserEntity } from './entities/user.entity';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async register({
    email,
    name,
    phone,
    password,
  }: UserRegisterDto): Promise<UserEntity | null> {
    const createdUser = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password,
      },
    });
    return createdUser;
    // TODO create custom Exception Filter
  }

  async getById(id: number) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });
    if (user) return user;
    throw new HttpException(
      `User with email ${id} not found`,
      HttpStatus.NOT_FOUND,
    );
  }

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

  async getByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    if (user) return user;
    throw new HttpException(
      `User with email ${email} not found`,
      HttpStatus.NOT_FOUND,
    );
  }

  async checkRefresh(id: number, tokenFromCookie: string) {
    const user = await this.getById(id);
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
