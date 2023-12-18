import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { Repository } from 'typeorm';
import { MemberDto } from './member.dto';
import { MemberVo } from './member.vo';
import { MemberReq } from './member-req.entity';
import { ManagerReqDto } from './manager-req.dto';
import { MemberReqVo } from './member-req.vo';
import { User } from 'src/user/user.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(MemberReq)
    private readonly memberReqRepository: Repository<MemberReq>,
  ) { }

  async requestManager(managerReq: ManagerReqDto, userSeq: number) {
    const memberReq = await this.memberReqRepository.save(new MemberReq({ ...managerReq, userSeq }));

    return new MemberReqVo(memberReq);
  }

  async requestMemberList(userSeq: number) {
    const targetList = await this.memberReqRepository.find({
      where: {
        managerSeq: userSeq,
        acceptYn: 'N',
        useYn: 'Y'
      }
    });

    return targetList.map(t => new MemberReqVo(t));
  }

  async accpetManager(managerReq: ManagerReqDto, userSeq: number) {
    const targetReq = await this.memberReqRepository.findOne({
      relations: {
        user: true
      },
      where: {
        managerSeq: userSeq,
        userSeq: managerReq.userSeq,
        acceptYn: 'N',
        useYn: 'Y'
      }
    });

    targetReq.acceptYn = managerReq.acceptYn;

    if (managerReq.acceptYn === 'Y') {
      // 응답시 멤버 추가 처리
      await this.memberRepository.save(
        new Member({
          name: targetReq.user.email,
          userSeq: targetReq.userSeq,
          managerSeq: userSeq, 
          useYn: 'Y'
        }),
      );
    }
    return new MemberReqVo(await this.memberReqRepository.save(targetReq));
  }
  async getMemberList4Manager(userSeq: number) {
    const memberList = await this.memberRepository.find({
      where: { useYn: 'Y', managerSeq: userSeq },
    });

    return memberList.map((m) => new MemberVo(m));
  }

  async getMemberList(userSeq: number) {
    const memberList = await this.memberRepository.find({
      where: { useYn: 'Y', userSeq },
    });

    return memberList.map((m) => new MemberVo(m));
  }

  async modiMember(memberDto: MemberDto, userSeq: number) {
    const m = await this.memberRepository.findOneOrFail({
      where: { seq: memberDto.seq, managerSeq: userSeq },
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
      where: { seq: memberSeq, managerSeq: userSeq },
    });
    await this.memberRepository.update(memberSeq, {
      useYn: 'N',
    });
  }
}
