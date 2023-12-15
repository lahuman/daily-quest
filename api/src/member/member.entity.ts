import { BaseEntity } from 'src/core/base-entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  nickNm: string;

  @Column({ nullable: true })
  managerSeq?: number;

  @Column()
  useYn: string;
}
