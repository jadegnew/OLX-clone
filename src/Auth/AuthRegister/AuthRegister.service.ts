import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../User/CreateUser/CreateUser.dto';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';
import { CreateUserService } from '../../User/CreateUser/CreateUser.service';
import { Logger } from '../../Logger/Logger.service';

@Injectable()
export class AuthRegisterService {
  constructor(
    private readonly configService: ConfigService,
    private readonly createUserService: CreateUserService,
    private readonly logger: Logger,
  ) {}
  async register(userData: CreateUserDto) {
    try {
      const passwordHash = await hash(
        userData.password,
        +this.configService.get('SALT'),
      );
      const user = await this.createUserService.register({
        ...userData,
        password: passwordHash,
      });
      this.logger.log(`New user ${user?.email} created.`, 'AuthService');
      return user;
    } catch (error) {
      this.logger.error('Error while creating User', 'AuthService');
      throw new HttpException(
        'User with this email or phone already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
