import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessAuthenticationGuard } from 'src/Auth/Strategies/AccessStrategy/access.guard';
import RequestWithUser from 'src/Interfaces/requestWithUser.interface';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './User.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  //TODO: add account CRUD
  constructor(private readonly userService: UserService) {}
  @Get('my-account')
  @UseGuards(AccessAuthenticationGuard)
  async createUser(@Req() req: RequestWithUser) {
    return this.userService.getById(req.user.id);
  }
}
