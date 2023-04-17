import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../Database/prisma.service';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
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
}
