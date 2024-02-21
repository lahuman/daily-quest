import { ApiProperty } from '@nestjs/swagger';
import { Member } from './member.entity';
import { User } from 'src/user/user.entity';

export class MemberVo {
  constructor(data: Partial<Member>) {
    this.seq = data.seq;
    this.userSeq = data.userSeq;
    this.managerSeq = data.managerSeq;
    this.name = data.name;
    this.managerName = data.managerName;
    this.totalPoint = data.totalPoint;
    this.color = data.color;
    this.user = data.user;
  }
  @ApiProperty()
  user?: User;

  @ApiProperty()
  seq: number;
  @ApiProperty()
  userSeq: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  managerSeq: number;
  @ApiProperty()
  managerName: string;
  @ApiProperty()
  color: string;
  @ApiProperty()
  totalPoint: number;
}
