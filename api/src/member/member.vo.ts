import { ApiProperty } from '@nestjs/swagger';
import { Member } from './member.entity';

export class MemberVo {
  constructor(data: Partial<Member>) {
    this.seq = data.seq;
    this.userSeq = data.userSeq;
    this.name = data.name;
    this.totalPoint = data.totalPoint
  }
  @ApiProperty()
  seq: number;
  @ApiProperty()
  userSeq: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  totalPoint: number;
}
