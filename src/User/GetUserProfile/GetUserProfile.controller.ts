import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GetUserProfileService } from './GetUserProfile.service';
import { AccessAuthenticationGuard } from 'src/Auth/Strategies/AccessStrategy/access.guard';
import RequestWithUser from 'src/Interfaces/requestWithUser.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class GetUserProfileController {
  constructor(private readonly userService: GetUserProfileService) {}
  //TODO get User profile

  // @Get('myaccount')
  // @UseGuards(AccessAuthenticationGuard)
  // async createUser(@Req() req: RequestWithUser) {
  //   return this.userService.getById(req.User.id);
  // }
}
