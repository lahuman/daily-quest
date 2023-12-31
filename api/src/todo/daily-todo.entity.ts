import { Member } from 'src/member/member.entity';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('daily_todo')
export class DailyTodo extends BaseEntity {
  constructor(data: Partial<DailyTodo>) {
    super();
    Object.assign(this, data);
  }
  @PrimaryGeneratedColumn()
  seq: number;

  @Column()
  userSeq: number;
  
  @Column()
  managerSeq: number;

  @Column()
  memberSeq: number;

  @Column({
    default: 0
  })
  point: number;

  @Column()
  @Index()
  type: string; // 매일(ED), 휴일(HD), 주말(WE), 평일(WD), 한번(OC)

  @Index()
  @Column()
  startDay: number;

  @Column()
  content: string;

  @Column('varchar', { default: 'Y' })
  useYn: string;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'member_seq', referencedColumnName: 'seq' })
  member?: Member;
}
