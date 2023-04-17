import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from '../../User/User/User.dto';
import { Logger } from '../../Logger/Logger.service';
import { UserService } from '../../User/User/User.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthLoginService {
  constructor(
    private readonly logger: Logger,
    private readonly userService: UserService,
  ) {}
  async login(userData: UserDto) {
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
