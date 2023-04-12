import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessAuthenticationGuard } from 'src/auth/AccessStrategy/access.guard';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('myaccount')
  @UseGuards(AccessAuthenticationGuard)
  async createUser(@Req() req: RequestWithUser) {
    return this.userService.getById(req.user.id);
  }
}
