import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserGuard } from 'src/user/user.guard';
import { MemberService } from './member.service';
import { AuthUser } from 'src/user/user.decorator';
import { UserVO } from 'src/user/user.vo';
import { MemberDto } from './member.dto';
import { MemberVo } from './member.vo';
import { ManagerReqDto } from './manager-req.dto';

@Controller('member')
@ApiTags('담당자')
@UseGuards(UserGuard)
@ApiBearerAuth()
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @Get('/manager')
  @ApiOperation({ summary: '나에게 요청한 목록 조회' })
  @ApiResponse({ status: 200, type: MemberVo })
  getList4ManagerReq(@AuthUser() userVo: UserVO) {
    return this.service.getMemberList4Manager(userVo.seq);
  }

  @Get('/res')
  @ApiOperation({ summary: '요청 된 사용자 목록' })
  @ApiResponse({ status: 200, type: MemberVo })
  getList4Res(@AuthUser() userVo: UserVO) {
    return this.service.getMemberList4Res(userVo.seq);
  }

  @Get('/req')
  @ApiOperation({ summary: '내가 요청한 목록 조회' })
  @ApiResponse({ status: 200, type: MemberVo })
  getList4Req(@AuthUser() userVo: UserVO) {
    return this.service.getMemberList4Req(userVo.seq);
  }

  @ApiOperation({ summary: '매니저 요청' })
  @ApiResponse({ status: 200, type: MemberVo })
  @Post('/req')
  request(@AuthUser() userVo: UserVO, @Body() managerReqDto: ManagerReqDto) {
    if (userVo.seq === managerReqDto.managerSeq) {
      throw new HttpException('잘못된 요청입니다.', HttpStatus.BAD_REQUEST);
    }
    return this.service.requestManager(managerReqDto, userVo.seq);
  }

  @ApiOperation({ summary: '매니저 요청 처리' })
  @ApiResponse({ status: 200, type: MemberVo })
  @Put('/req')
  acceptReq(@AuthUser() userVo: UserVO, @Body() managerReqDto: ManagerReqDto) {
    return this.service.acceptManager(managerReqDto, userVo.seq);
  }

  @ApiOperation({ summary: '멤버 추가' })
  @ApiResponse({ status: 200, type: MemberVo })
  @Post()
  save(@AuthUser() userVo: UserVO, @Body() memberDto: MemberDto) {
    return this.service.saveMember(memberDto, userVo.seq);
  }

  @Get()
  @ApiOperation({ summary: '나의 멤버 목록 조회' })
  @ApiResponse({ status: 200, type: MemberVo })
  getMemberList(@AuthUser() userVo: UserVO) {
    return this.service.getMemberList(userVo.seq);
  }

  @ApiOperation({ summary: '나의 멤버 수정 처리' })
  @ApiResponse({ status: 200, type: MemberVo })
  @Put()
  update(@AuthUser() userVo: UserVO, @Body() memberDto: MemberDto) {
    return this.service.modiMember(memberDto, userVo.seq);
  }
}
