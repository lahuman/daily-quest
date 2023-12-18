import { ApiProperty } from '@nestjs/swagger';
import { Member } from './member.entity';

export class MemberVo {
  constructor(data: Partial<Member>) {
    this.seq = data.seq;
    this.userSeq = data.userSeq;
    this.managerSeq = data.managerSeq;
    this.name = data.name;
    this.totalPoint = data.totalPoint;
    this.color = data.color;
  }
  @ApiProperty()
  seq: number;
  @ApiProperty()
  userSeq: number;
  @ApiProperty()
  managerSeq: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  color: string;
  @ApiProperty()
  totalPoint: number;
}
