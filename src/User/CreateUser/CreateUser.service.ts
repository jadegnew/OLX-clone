import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Database/prisma.service';
import { CreateUserDto } from './CreateUser.dto';
import { UserEntity } from '../User/User.entity';

@Injectable()
export class CreateUserService {
  constructor(private readonly prismaService: PrismaService) {}
  async register({
    email,
    name,
    phone,
    password,
  }: CreateUserDto): Promise<UserEntity | null> {
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
}
