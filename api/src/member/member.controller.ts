import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
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
  @ApiOperation({ summary: '내가 요청한 목록 조회' })
  @ApiResponse({ status: 200, type: MemberVo })
  getList4Date(@AuthUser() userVo: UserVO) {
    return this.service.getMemberList4Req(userVo.seq);
  }

  @ApiOperation({ summary: '매니저 요청' })
  @ApiResponse({ status: 200, type: MemberVo })
  @Post("/req")
  request(@AuthUser() userVo: UserVO, @Body() managerReqDto: ManagerReqDto) {
    if(userVo.seq === managerReqDto.managerSeq) {
      throw new HttpException("Can't Request!", HttpStatus.BAD_REQUEST);
    }
    return this.service.requestManager(managerReqDto, userVo.seq);
  }

  @ApiOperation({ summary: '매니저 요청 처리' })
  @ApiResponse({ status: 200, type: MemberVo })
  @Put("/req")
  acceptReq(@AuthUser() userVo: UserVO, @Body() managerReqDto: ManagerReqDto) {
    return this.service.accpetManager(managerReqDto, userVo.seq);
  }

  @ApiOperation({ summary: '멤버 추가' })
  @ApiResponse({ status: 200, type: MemberVo })
  @Post()
  save(@AuthUser() userVo: UserVO, @Body() memberDto: MemberDto) {
    return this.service.saveMember(memberDto, userVo.seq);
  }

  @Get()
  @ApiOperation({ summary: '관리 목록 조회' })
  @ApiResponse({ status: 200, type: MemberVo })
  getMemberList(@AuthUser() userVo: UserVO) {
    return this.service.getMemberList(userVo.seq);
  }

  
}
