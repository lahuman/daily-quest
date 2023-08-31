import {
  BaseEntity,
  Column,
  Entity,
  Index,
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
  memberSeq: number;

  @Column({
    default: 0
  })
  point: number;

  @Index()
  @Column()
  startDay: number;

  @Column()
  content: string;

  @Column('varchar', { default: 'Y' })
  useYn: string;
}
