import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { DailyTodo } from './daily-todo.entity';
import { DataSource, LessThanOrEqual, Repository } from 'typeorm';
import { CreateTodoDto, TODO_TYPE, TodoDto } from './todo.dto';
import { TodoVo } from './todo.vo';
import { Member } from 'src/member/member.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(DailyTodo)
    private readonly dailyTodoRepository: Repository<DailyTodo>,
    private dataSource: DataSource,
  ) {}

  async saveTodo(createTodo: CreateTodoDto, userSeq: number) {
    console.log(createTodo.managerSeq === 0);
    console.log(createTodo.managerSeq);
    if (createTodo.managerSeq === 0) {
      createTodo.managerSeq = userSeq;
      createTodo.userSeq = userSeq;
    } else {
      createTodo.userSeq = createTodo.managerSeq;
      createTodo.managerSeq = userSeq;
    }

    console.log(createTodo);
    if (createTodo.type === TODO_TYPE.ED) {
      const dailyTodo = await this.dailyTodoRepository.save(
        new DailyTodo({
          ...createTodo,
          startDay: parseInt(createTodo.todoDay),
        }),
      );
      const todo = await this.todoRepository.save(
        new Todo({
          ...createTodo,
          dailyTodoSeq: dailyTodo.seq,
        }),
      );
      return new TodoVo(todo);
    } else {
      const todo = await this.todoRepository.save(
        new Todo({
          ...createTodo,
        }),
      );
      return new TodoVo(todo);
    }
  }

  async getTodoList(dateStr: string, userSeq: number) {
    const [todo, todayDaily, dailyTodo] = await Promise.all([
      this.todoRepository.find({
        where: [
          { type: TODO_TYPE.OC, useYn: 'Y', userSeq, todoDay: dateStr },
          {
            type: TODO_TYPE.OC,
            useYn: 'Y',
            managerSeq: userSeq,
            todoDay: dateStr,
          },
        ],
      }),
      this.todoRepository.find({
        where: [
          { type: TODO_TYPE.ED, todoDay: dateStr, useYn: 'Y', userSeq },
          {
            type: TODO_TYPE.ED,
            todoDay: dateStr,
            useYn: 'Y',
            managerSeq: userSeq,
          },
        ],
      }),
      this.dailyTodoRepository.find({
        where: [
          {
            useYn: 'Y',
            userSeq,
            startDay: LessThanOrEqual(parseInt(dateStr)),
          },
          {
            useYn: 'Y',
            managerSeq: userSeq,
            startDay: LessThanOrEqual(parseInt(dateStr)),
          },
        ],
      }),
    ]);
    const allTodoList = [
      ...dailyTodo
        .filter((d) => !todayDaily.some((t) => t.dailyTodoSeq === d.seq))
        .map((d) => ({
          type: TODO_TYPE.ED,
          dailyTodoSeq: d.seq,
          content: d.content,
          todoDay: dateStr,
          point: d.point,
          managerSeq: d.managerSeq,
        })),
      ...todo,
      ...todayDaily,
    ];

    allTodoList.sort((a, b) => {
      if (a['completeYn'] === 'Y') return 1;
      if (a['completeYn'] === 'N') return -1;
      return 0;
    });

    return allTodoList;
  }

  async removeTodo(todoDto: TodoDto, userSeq: number) {
    if (todoDto.type === TODO_TYPE.ED) {
      const daily = await this.dailyTodoRepository.findOne({
        where: {
          managerSeq: userSeq,
          seq: todoDto.dailyTodoSeq,
          useYn: 'Y',
        },
      });
      if (daily) {
        daily.useYn = 'N';
        if (isNaN(daily.point)) daily.point = 0;

        await this.dailyTodoRepository.save(daily);
      }
    }
    const todo = await this.todoRepository.findOne({
      where: {
        managerSeq: userSeq,
        seq: todoDto.seq,
        todoDay: todoDto.todoDay,
        useYn: 'Y',
      },
    });
    if (todo) {
      todo.useYn = 'N';
      if (isNaN(todo.point)) todo.point = 0;
      await this.todoRepository.save(todo);
    }
  }

  async todoComplete(todoDto: TodoDto, userSeq: number) {
    let todo: Todo;
    if (todoDto.seq) {
      todo = await this.todoRepository.findOneOrFail({
        where: {
          userSeq,
          seq: todoDto.seq,
          useYn: 'Y',
        },
      });
    } else if (todoDto.dailyTodoSeq) {
      todo = await this.todoRepository.findOne({
        where: {
          userSeq,
          dailyTodoSeq: todoDto.dailyTodoSeq,
          todoDay: todoDto.todoDay,
          useYn: 'Y',
        },
      });
    }

    await this.dataSource.transaction(async (manager) => {
      if (todo) {
        // 2번 동일 요청의 경우
        if (todo.completeYn === todoDto.completeYn) return;

        todo.completeYn = todoDto.completeYn;
        todo.todoDay = todoDto.todoDay;
      } else {
        const newTodo = await this.dailyTodoRepository.findOneOrFail({
          where: {
            userSeq,
            useYn: 'Y',
            seq: todoDto.dailyTodoSeq,
          },
        });
        todo = new Todo({
          userSeq,
          content: newTodo.content,
          dailyTodoSeq: newTodo.seq,
          managerSeq: newTodo.managerSeq,
          point: newTodo.point,
          type: TODO_TYPE.ED,
          completeYn: todoDto.completeYn,
          todoDay: todoDto.todoDay,
        });
      }

      if (isNaN(todo.point)) todo.point = 0;
      await manager.save(todo);
      // 포인트 관리를 위해, 이후 member는 개인이 추가 할 수 없음...
      const m = await manager.findOne(Member, {
        where: { userSeq: todo.userSeq, managerSeq: todo.managerSeq },
      });
      if (isNaN(m.totalPoint)) m.totalPoint = 0;
      if (todo.completeYn === 'Y') m.totalPoint += todo.point;
      else m.totalPoint -= todo.point;
      if (!isNaN(m.totalPoint)) await manager.save(m);
    });
  }
}
