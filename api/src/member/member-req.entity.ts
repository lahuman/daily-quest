import { BaseEntity } from 'src/core/base-entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('member_req')
export class MemberReq extends BaseEntity {
  constructor(data: Partial<MemberReq>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  seq: number;

  @Column()
  userSeq: number;

  @Column()
  managerSeq: number;

  @Column({ default: 'N' })
  acceptYn: string;

  @Column({ default: 'Y' })
  useYn: string;


  @OneToOne(() => User)
  @JoinColumn({name: "user_seq", referencedColumnName: "seq"})
  requesters: User;

  @OneToOne(() => User)
  @JoinColumn({name: "manager_seq", referencedColumnName: "seq"})
  managers: User;
}
