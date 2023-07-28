import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  content: string;

  @Column('varchar', { default: 'Y' })
  useYn: string;
}
