import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { MemberReq } from './member-req.entity';
import { User } from '../user/user.entity';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, MemberReq, User]),
    FirebaseModule,
  ],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
