import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../User/CreateUser/CreateUser.dto';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
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
      userData.password = passwordHash;
      const createdUser = await this.createUserService.register(userData);
      this.logger.log(`New user ${createdUser?.email} created.`, 'AuthService');
      return createdUser;
    } catch (error) {
      this.logger.error('Error while creating User', 'AuthService');
      throw new HttpException(
        //TODO make normal exceptions
        'Error while creating User',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
