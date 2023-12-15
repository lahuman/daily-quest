import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { Repository } from 'typeorm';
import { MemberDto } from './member.dto';
import { MemberVo } from './member.vo';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async saveMember(memberDto: MemberDto, userSeq: number) {
    const member = await this.memberRepository.save(
      new Member({ ...memberDto, userSeq, useYn: 'Y' }),
    );
    return new MemberVo(member);
  }

  async getMemberList(userSeq: number) {
    const memberList = await this.memberRepository.find({
      where: { useYn: 'Y', userSeq },
    });

    return memberList.map((m) => new MemberVo(m));
  }

  async modiMember(memberDto: MemberDto, userSeq: number) {
    const m = await this.memberRepository.findOneOrFail({
      where: { seq: memberDto.seq, userSeq },
    });

    const member = await this.memberRepository.update(m.seq, {
      ...m,
      name: memberDto.name,
      color: memberDto.color,
    });
    return new MemberVo(memberDto);
  }

  async removeMember(memberSeq: number, userSeq: number) {
    await this.memberRepository.findOneOrFail({
      where: { seq: memberSeq, userSeq },
    });
    await this.memberRepository.update(memberSeq, {
      useYn: 'N',
    });
  }
}
