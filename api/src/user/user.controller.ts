import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { FirebaseUser } from '../firebase/firebase-user.decorator';
import { FirebaseGuard } from '../firebase/firebase.guard';
import { UserService } from './users.service';
import { RequestHeaders } from '../core/request-headers.decorator';
import { RefreshHeaderDTO } from './refresh-header.dto';
import { UserGuard } from './user.guard';
import { AuthUser } from './user.decorator';
import { UserVO } from './user.vo';

@Controller('user')
@ApiTags('회원 처리')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signIn')
  @ApiOperation({ summary: '로그인 처리' })
  @UseGuards(FirebaseGuard)
  signIn(@FirebaseUser() firebaseUser: DecodedIdToken) {
    return this.userService.signIn(firebaseUser);
  }

  @ApiOperation({ summary: '사용자 토큰 만료시 refresh 토큰으로 호출' })
  @Post('/refresh')
  refresh(@RequestHeaders() headers: RefreshHeaderDTO) {
    return this.userService.tokenRefresh(
      headers.authorization.split('Bearer ')[1],
    );
  }

  @ApiOperation({ summary: '이메일 기준 사용자 seq 조회' })
  @Get('/searchEmail')
  @UseGuards(UserGuard)
  async existEmail(@Query('email') email: string) {
    return await this.userService.existEmail(email);
  }

  @ApiOperation({ summary: '이메일 기준 사용자 seq 조회' })
  @Post('/settingDeviceToken')
  @UseGuards(UserGuard)
  async deviceToken(
    @AuthUser() userVo: UserVO,
    @Body('deviceToken') deviceToken: string,
  ) {
    return await this.userService.updateDeviceToken(userVo.seq, deviceToken);
  }
}
