import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/user')
  users(@Req() request: any) {
    return this.usersService.getUserById('userId');
  }
}
