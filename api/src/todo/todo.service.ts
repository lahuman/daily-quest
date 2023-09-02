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
    if (createTodo.type === TODO_TYPE.DT) {
      const dailyTodo = await this.dailyTodoRepository.save(
        new DailyTodo({
          ...createTodo,
          userSeq,
          startDay: parseInt(createTodo.todoDay),
        }),
      );
      const todo = await this.todoRepository.save(
        new Todo({
          ...createTodo,
          userSeq,
          dailyTodoSeq: dailyTodo.seq,
        }),
      );
      return new TodoVo(todo);
    } else {
      const todo = await this.todoRepository.save(
        new Todo({
          ...createTodo,
          userSeq,
        }),
      );
      return new TodoVo(todo);
    }
  }

  async getTodoList(dateStr: string, userSeq: number) {
    const [todo, todayDaily, dailyTodo] = await Promise.all([
      this.todoRepository.find({
        where: { type: TODO_TYPE.T, useYn: 'Y', userSeq, todoDay: dateStr },
      }),
      this.todoRepository.find({
        where: { type: TODO_TYPE.DT, todoDay: dateStr, useYn: 'Y', userSeq },
      }),
      this.dailyTodoRepository.find({
        where: {
          useYn: 'Y',
          userSeq,
          startDay: LessThanOrEqual(parseInt(dateStr)),
        },
      }),
    ]);
    const allTodoList = [
      ...dailyTodo
        .filter((d) => !todayDaily.some((t) => t.dailyTodoSeq === d.seq))
        .map((d) => ({
          type: TODO_TYPE.DT,
          dailyTodoSeq: d.seq,
          content: d.content,
          todoDay: dateStr,
          point: d.point,
          memberSeq: d.memberSeq,
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
    if (todoDto.type === TODO_TYPE.DT) {
      const daily = await this.dailyTodoRepository.findOne({
        where: {
          userSeq,
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
        userSeq,
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
          memberSeq: newTodo.memberSeq,
          point: newTodo.point,
          type: TODO_TYPE.DT,
          completeYn: todoDto.completeYn,
          todoDay: todoDto.todoDay,
        });
      }
      if (!todo.memberSeq) {
        delete todo.memberSeq;
      }
      if (isNaN(todo.point)) todo.point = 0;
      await manager.save(todo);
      if (todo.memberSeq) {
        const m = await manager.findOne(Member, {
          where: { seq: todo.memberSeq },
        });
        if (todo.completeYn === 'Y') m.totalPoint += todo.point;
        else m.totalPoint -= todo.point;
        if (!isNaN(m.totalPoint)) await manager.save(m);
      }
    });
  }
}
