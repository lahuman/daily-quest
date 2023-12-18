import { ApiProperty } from '@nestjs/swagger';
import { MemberReq } from './member-req.entity';

export class MemberReqVo {
  constructor(data: Partial<MemberReq>) {
    this.seq = data.seq;
    this.userSeq = data.userSeq;
    this.managerSeq = data.managerSeq;
    this.acceptYn = data.acceptYn;
  }
  @ApiProperty()
  seq: number;
  @ApiProperty()
  userSeq: number;
  @ApiProperty()
  managerSeq: number;
  @ApiProperty()
  acceptYn: string;
}
