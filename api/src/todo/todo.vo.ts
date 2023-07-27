import { Todo } from './todo.entity';

export class TodoVo {
  constructor(data: Partial<Todo>) {
    Object.assign(this, data);
  }
  seq: number;
  userSeq: number;
  dailyTodoSeq: number;
  missionDay: string;
  type: string;
  content: string;
  completeYn: string;
  useYn: string;
}
