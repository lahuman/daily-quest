import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Roles } from './auth/roles.decorator';
import { USER_ROLE } from './auth/role.enum';
import { RolesGuard } from './auth/roles.guard';
import { SignUpDto } from './auth/signup.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Get('login')
  @Render('login')
  login() {
    return;
  }

  @Get('signup')
  @Render('signup')
  signup() {
    return;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('auth/login')
  // async login(@Request() req) {
  //   return this.authService.login(req.user);
  // }

  // @Post('api/auth/signup')
  // async signup(@Body() signUpDto: SignUpDto) {
  //   return this.authService.signup(signUpDto.username, signUpDto.password);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('api/test/profile')
  async getProfile(@Request() req) {
    const user = await this.userService.getProfile(req.user.username);
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.Admin)
  @Get('api/test/user')
  getProtected() {
    return 'protected data';
  }
}
