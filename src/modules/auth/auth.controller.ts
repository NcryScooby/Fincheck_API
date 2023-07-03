import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin';
import { SignUpDto } from './dto/signup';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @Post('signup')
  create(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }
}
