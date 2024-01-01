import { BaseEntity } from 'src/core/base-entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('member')
export class Member extends BaseEntity {
  constructor(data: Partial<Member>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  seq: number;

  @Column()
  userSeq: number;

  @Column({
    default: 0,
  })
  totalPoint: number;

  @Column()
  name: string;

  @Column({ default: '#000000' })
  color: string;

  @Column()
  managerSeq: number;

  @Column()
  useYn: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_seq', referencedColumnName: 'seq' })
  user: User;
}
