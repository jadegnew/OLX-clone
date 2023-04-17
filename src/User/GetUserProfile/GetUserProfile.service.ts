import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Database/prisma.service';
import { CreateUserDto } from 'src/User/CreateUser/CreateUser.dto';
import { UserEntity } from '../User/user.entity';
import { compare } from 'bcrypt';

@Injectable()
export class GetUserProfileService {
  constructor(private readonly prismaService: PrismaService) {}
}
