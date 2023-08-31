import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGuard } from 'src/user/user.guard';
import { MemberService } from './member.service';
import { AuthUser } from 'src/user/user.decorator';
import { UserVO } from 'src/user/user.vo';
import { MemberDto } from './member.dto';
import { MemberVo } from './member.vo';

@Controller('member')
@ApiTags("담당자")
@UseGuards(UserGuard)
@ApiBearerAuth()
export class MemberController {
    constructor(private readonly service: MemberService) {}


  @ApiOperation({ summary: '담당자 추가' })
  @ApiResponse({ status: 201, type: MemberVo })
  @Post()
  save(@AuthUser() userVo: UserVO, @Body() createTodo: MemberDto) {
    return this.service.saveMember(createTodo, userVo.seq);
  }

  @Get()
  @ApiOperation({ summary: '담당자 목록 조회' })
  @ApiResponse({ status: 200, type: MemberVo })
  getList4Date(@AuthUser() userVo: UserVO) {
    return this.service.getMemberList(userVo.seq);
  }

  @ApiOperation({ summary: '담당자 변경' })
  @ApiResponse({ status: 200, type: MemberVo })
  @Put()
  update(@AuthUser() userVo: UserVO, @Body() createTodo: MemberDto) {
    return this.service.modiMember(createTodo, userVo.seq);
  }

}
