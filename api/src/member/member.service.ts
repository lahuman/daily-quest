import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { DataSource, Not, Repository } from 'typeorm';
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
  ) { }

  async requestManager(managerReq: ManagerReqDto, userSeq: number) {
    const alreadyReq = await this.memberReqRepository.count({
      where: {
        userSeq: userSeq,
        managerSeq: managerReq.managerSeq,
        useYn: 'Y',
      },
    });

    const alreadyMember = await this.memberRepository.count({
      where: {
        userSeq: userSeq,
        managerSeq: managerReq.managerSeq,
        useYn: 'Y',
      },
    });
    if (alreadyReq + alreadyMember > 0) {
      throw new HttpException('Already Exist', HttpStatus.CONFLICT);
    }

    const memberReq = await this.memberReqRepository.save(
      new MemberReq({ ...managerReq, userSeq: userSeq }),
    );

    return new MemberReqVo(memberReq);
  }

  async requestMemberList(userSeq: number) {
    const targetList = await this.memberReqRepository.find({
      relations: {
        requester: true,
      },
      where: {
        managerSeq: userSeq,
        acceptYn: 'N',
        useYn: 'Y',
      },
    });

    return targetList.map((t) => new MemberReqVo(t));
  }

  async acceptManager(managerReq: ManagerReqDto, userSeq: number) {
    const targetReq = await this.memberReqRepository.findOneOrFail({
      relations: {
        requester: true,
      },
      where: {
        managerSeq: userSeq,
        userSeq: managerReq.userSeq,
        acceptYn: 'N',
        useYn: 'Y',
      },
    });

    targetReq.acceptYn = managerReq.acceptYn;
    if (targetReq.acceptYn === 'N') {
      targetReq.useYn = 'N';
    }

    // transaction 처리
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (managerReq.acceptYn === 'Y') {

        const user = await this.userRepository.findOneOrFail({
          where: {
            seq: managerReq.managerSeq,
          }
        });

        // 응답시 멤버 추가 처리
        await this.memberRepository.save(
          new Member({
            name: targetReq.requester.email,
            userSeq: targetReq.userSeq,
            managerSeq: userSeq,
            managerName: user.email,
            useYn: 'Y',
          }),
        );
      }
      const memberReqVo = new MemberReqVo(
        await this.memberReqRepository.save(targetReq),
      );

      await queryRunner.commitTransaction();
      return memberReqVo;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async getMemberList4Manager(userSeq: number) {
    const memberList = await this.memberRepository.find({
      where: { useYn: 'Y', managerSeq: userSeq, userSeq: Not(userSeq) },
    });

    return memberList.map((m) => new MemberVo(m));
  }

  async getMemberList4Res(userSeq: number) {
    const memberList = await this.memberReqRepository.find({
      relations: {
        manager: true,
        requester: true,
      },
      where: {
        useYn: 'Y',
        managerSeq: userSeq,
        userSeq: Not(userSeq),
      },
    });

    return memberList.map((m) => new MemberReqVo(m));
  }

  async getMemberList4Req(userSeq: number) {
    const memberList = await this.memberReqRepository.find({
      relations: {
        manager: true,
      },
      where: { useYn: 'Y', managerSeq: Not(userSeq), userSeq: userSeq },
    });
    const managerList = await Promise.all(memberList.filter(m => m.acceptYn === 'Y').map(m =>
      this.memberRepository.findOne({
        where: {
          userSeq: m.userSeq,
          managerSeq: m.managerSeq,
          useYn: 'Y'
        }
      })
    ));

    return memberList.map((m) => new MemberReqVo(m)).map(mr => {
      const filterd = managerList.filter(m => m.managerSeq === mr.managerSeq && m.userSeq === mr.userSeq)
      if (filterd.length > 0) mr.managerName = filterd[0].managerName;
      return mr;
    });

  }


  async updateMemberReqName(userSeq: number, reqSeq: number, name: string) {
    const reqData = await this.memberReqRepository.findOneOrFail({
      relations: {
        manager: true,
      },
      where: { useYn: 'Y', acceptYn: 'Y', seq: reqSeq, managerSeq: Not(userSeq), userSeq: userSeq },
    });

    const member = await this.memberRepository.findOneOrFail({
      where: {
        managerSeq: reqData.managerSeq,
        useYn: 'Y'
      }
    })

    member.managerName = name;

    await this.memberRepository.save(member);
    return new MemberVo(member);
  }

  async getMemberList(userSeq: number) {
    const memberList = await this.memberRepository.find({
      relations: {
        user: true,
      },
      where: { useYn: 'Y', managerSeq: userSeq },
    });

    return memberList.map((m) => new MemberVo(m));
  }

  async saveMember(memberDto: MemberDto, userSeq: number) {
    const member = await this.memberRepository.save(
      new Member({
        ...memberDto,
        userSeq: userSeq,
        managerName: '',
        managerSeq: userSeq,
        useYn: 'Y',
      }),
    );
    return member;
  }

  async modiMember(memberDto: MemberDto, userSeq: number) {
    const m = await this.memberRepository.findOneOrFail({
      where: {
        seq: memberDto.seq,
        managerSeq: userSeq,
      },
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
