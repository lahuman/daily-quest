import { ApiProperty } from '@nestjs/swagger';
import { MemberReq } from './member-req.entity';
import { User } from 'src/user/user.entity';

export class MemberReqVo {
  constructor(data: Partial<MemberReq>) {
    this.seq = data.seq;
    this.userSeq = data.userSeq;
    this.managerSeq = data.managerSeq;
    this.acceptYn = data.acceptYn;
    this.email = data?.manager?.email;
    this.userEmail = data?.requester?.email;
  }
  @ApiProperty()
  seq: number;
  @ApiProperty()
  userSeq: number;
  @ApiProperty()
  managerSeq: number;
  @ApiProperty()
  managerName?: string;
  @ApiProperty()
  acceptYn: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  userEmail: string;
}
