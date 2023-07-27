import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/user/user.decorator';
import { UserGuard } from 'src/user/user.guard';
import { UserVO } from 'src/user/user.vo';

@Controller('todo')
@ApiBearerAuth()
@ApiTags('미션 처리')
@UseGuards(UserGuard)
export class TodoController {
  @Get()
  todayList(@AuthUser() userVo: UserVO) {
    return userVo;
  }
}
