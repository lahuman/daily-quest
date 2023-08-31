import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('todo')
export class Todo extends BaseEntity {
  constructor(data: Partial<Todo>) {
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

  @Column()
  dailyTodoSeq: number;

  @Column()
  todoDay: string;

  @Column()
  type: string;

  @Column()
  content: string;

  @Column('varchar', { default: 'N' })
  completeYn: string;

  @Column('varchar', { default: 'Y' })
  useYn: string;
}
