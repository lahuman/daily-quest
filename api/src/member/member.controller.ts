import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGuard } from 'src/user/user.guard';
import { MemberService } from './member.service';
import { AuthUser } from 'src/user/user.decorator';
import { UserVO } from 'src/user/user.vo';
import { MemberDto } from './member.dto';
import { MemberVo } from './member.vo';
import { ManagerReqDto } from './manager-req.dto';

@Controller('member')
@ApiTags("담당자")
@UseGuards(UserGuard)
@ApiBearerAuth()
export class MemberController {
  constructor(private readonly service: MemberService) { }

  @Get("/manager")
  @ApiOperation({ summary: '매니저 기준 사용자 요청 목록 조회' })
  @ApiResponse({ status: 200, type: MemberVo })
  getList4ManagerReq(@AuthUser() userVo: UserVO) {
    return this.service.getMemberList4Manager(userVo.seq);
  }

  @Get("/req")
  @ApiOperation({ summary: '나에게 요청한 사용자 목록 조회' })
  @ApiResponse({ status: 200, type: MemberVo })
  getList4Date(@AuthUser() userVo: UserVO) {
    return this.service.getMemberList(userVo.seq);
  }

  @ApiOperation({ summary: '매니저 요청' })
  @ApiResponse({ status: 200, type: MemberVo })
  @Post("/req")
  request(@AuthUser() userVo: UserVO, @Body() managerReqDto: ManagerReqDto) {
    return this.service.requestManager(managerReqDto, userVo.seq);
  }

  @ApiOperation({ summary: '매니저 요청 처리' })
  @ApiResponse({ status: 200, type: MemberVo })
  @Put("/req")
  acceptReq(@AuthUser() userVo: UserVO, @Body() managerReqDto: ManagerReqDto) {
    return this.service.accpetManager(managerReqDto, userVo.seq);
  }

}
