import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { DailyTodo } from './daily-todo.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto, TODO_TYPE, TodoDto } from './todo.dto';
import { TodoVo } from './todo.vo';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(DailyTodo)
    private readonly dailyTodoRepository: Repository<DailyTodo>,
  ) {}

  async saveTodo(createTodo: CreateTodoDto, userSeq: number) {
    if (createTodo.type === TODO_TYPE.DT) {
      const dailyTodo = await this.dailyTodoRepository.save(
        new DailyTodo({ ...createTodo, userSeq }),
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
        where: { useYn: 'Y', userSeq },
      }),
    ]);
    return [
      ...todo,
      ...todayDaily,
      ...dailyTodo
        .filter((d) => !todayDaily.some((t) => t.dailyTodoSeq === d.seq))
        .map((d) => ({
          type: TODO_TYPE.DT,
          dailyTodoSeq: d.seq,
          content: d.content,
          todoDay: dateStr,
        })),
    ];
  }

  async removeTodo(todoDto: TodoDto, userSeq: number) {
    if (todoDto.type === TODO_TYPE.DT) {
      const daily = await this.dailyTodoRepository.findOneOrFail({
        where: {
          userSeq,
          seq: todoDto.dailyTodoSeq,
          useYn: 'Y',
        },
      });
      daily.useYn = 'N';
      await this.dailyTodoRepository.save(daily);
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
      await this.todoRepository.save(todo);
    }
  }

  async todoComplete(todoDto: TodoDto, userSeq: number) {
    let todo;
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
    if (todo) {
      todo.completeYn = todoDto.completeYn;
      todo.todoDay = todoDto.todoDay;
      await this.todoRepository.save(todo);
    } else {
      const newTodo = await this.dailyTodoRepository.findOneOrFail({
        where: {
          userSeq,
          useYn: 'Y',
          seq: todoDto.dailyTodoSeq,
        },
      });
      await this.todoRepository.save(
        new Todo({
          userSeq,
          content: newTodo.content,
          dailyTodoSeq: newTodo.seq,
          type: TODO_TYPE.DT,
          completeYn: todoDto.completeYn,
          todoDay: todoDto.todoDay,
        }),
      );
    }
  }
}
