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
  dailyTodoSeq: number;

  @Column()
  todoDay: string;

  @Column()
  type: string;

  @Column()
  content: string;

  @Column()
  completeYn: string;

  @Column()
  useYn: string;
}
