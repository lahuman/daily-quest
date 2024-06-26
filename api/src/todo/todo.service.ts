import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { DailyTodo } from './daily-todo.entity';
import { DataSource, LessThanOrEqual, Not, Repository } from 'typeorm';
import { CreateTodoDto, TODO_TYPE, TodoDto } from './todo.dto';
import { TodoVo } from './todo.vo';
import { Member } from '../member/member.entity';
import { FirebaseService } from '../firebase/firebase.service';
import { User } from '../user/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(DailyTodo)
    private readonly dailyTodoRepository: Repository<DailyTodo>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
    private firebaseService: FirebaseService,
  ) { }

  private async getUserInfos(userSeq) {
    return await this.userRepository.findOneOrFail({
      where: {
        seq: userSeq,
      },
    });
  }

  private async sendMessage(
    deviceToken: string,
    title: string,
    body: string,
    url: string,
  ) {
    try {
      //메시지 발송시 오류는 무시.
      if (deviceToken) {
        await this.firebaseService.sendMessage({
          notification: {
            title,
            body,
          },
          data: {
            url,
          },
          token: deviceToken,
        });
      }
    } catch (e) { }
  }

  async saveTodo(createTodo: CreateTodoDto, userSeq: number) {
    if (createTodo.memberSeq) {
      const memberInfo = await this.memberRepository.findOneOrFail({
        where: {
          seq: createTodo.memberSeq,
          managerSeq: userSeq,
          useYn: 'Y',
        },
      });
      createTodo.managerSeq = memberInfo.managerSeq;
      createTodo.userSeq = memberInfo.userSeq;

      const userInfo = await this.getUserInfos(memberInfo.userSeq);

      await this.sendMessage(
        userInfo.deviceToken,
        `[${createTodo.todoDay}] ${memberInfo.managerName} 님으로부터`,
        `할일 "${createTodo.content}"가 등록 되었습니다.`,
        `/todo?today=${createTodo.todoDay}`,
      );
    } else {
      createTodo.userSeq = userSeq;
      createTodo.managerSeq = userSeq;
      createTodo.memberSeq = 0;
    }

    if (createTodo.type !== TODO_TYPE.OC) {
      const dailyTodo = await this.dailyTodoRepository.save(
        new DailyTodo({
          ...createTodo,
          startDay: parseInt(createTodo.todoDay),
        }),
      );
    } else {
      const todo = await this.todoRepository.save(
        new Todo({
          ...createTodo,
        }),
      );
      return new TodoVo(todo);
    }
  }

  async isHoliHoliday(dateStr: string): Promise<boolean> {
    const isHolidayBody = await fetch(`https://lahuman.vercel.app/api/isHoliday/${dateStr}`)
    const { holiday } = await isHolidayBody.json()
    return holiday
  }

  async getTodoList(dateStr: string, userSeq: number) {
    // 금일이 평일 일 경우 OC, ED, WD
    // 금일이 주말아닌 휴일 일 경우 OC, ED, HO
    // https://lahuman.vercel.app/api/isHoliday/${date}

    let addType = TODO_TYPE.WD;
    let ignoreType = TODO_TYPE.HD
    if (await this.isHoliHoliday(dateStr)) {
      addType = TODO_TYPE.HD;
      ignoreType = TODO_TYPE.WD
    }


    const [todo, todayDaily,todayAdd, dailyTodo] = await Promise.all([
      this.todoRepository.find({
        relations: {
          member: true,
        },
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
        relations: {
          member: true,
        },
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
      this.todoRepository.find({
        relations: {
          member: true,
        },
        where: [
          { type: addType, todoDay: dateStr, useYn: 'Y', userSeq },
          {
            type: addType,
            todoDay: dateStr,
            useYn: 'Y',
            managerSeq: userSeq,
          },
        ],
      }),
      this.dailyTodoRepository.find({
        relations: {
          member: true,
        },
        where: [
          {
            type: Not(ignoreType),
            useYn: 'Y',
            userSeq,
            startDay: LessThanOrEqual(parseInt(dateStr)),
          },
          {
            type: Not(ignoreType),
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
          type: d.type,
          dailyTodoSeq: d.seq,
          content: d.content,
          todoDay: dateStr,
          point: d.point,
          managerSeq: d.managerSeq,
          userSeq: d.userSeq,
          memberSeq: d.memberSeq,
          member: d.member,
        })),
      ...todo,
      ...todayDaily,
      ...todayAdd,
    ];

    allTodoList.sort((a, b) => {
      if (a['completeYn'] === 'Y') return 1;
      if (a['completeYn'] === 'N') return -1;
      return 0;
    });

    return allTodoList;
  }

  async removeTodo(todoDto: TodoDto, userSeq: number) {
    if (todoDto.type !== TODO_TYPE.OC) {
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
          memberSeq: newTodo.memberSeq,
          point: newTodo.point,
          type: TODO_TYPE.ED,
          completeYn: todoDto.completeYn,
          todoDay: todoDto.todoDay,
        });
      }

      if (isNaN(todo.point)) todo.point = 0;
      await manager.save(todo);
      if (todo.memberSeq) {
        const m = await manager.findOne(Member, {
          where: { seq: todo.memberSeq, useYn: 'Y', userSeq },
        });
        if (isNaN(m.totalPoint)) m.totalPoint = 0;
        if (todo.completeYn === 'Y') m.totalPoint += todo.point;
        else m.totalPoint -= todo.point;
        if (!isNaN(m.totalPoint)) await manager.save(m);

        if (todo.managerSeq !== userSeq) {
          const userInfo = await this.getUserInfos(todo.managerSeq);

          const manager = await this.memberRepository.findOneOrFail({
            where: {
              managerSeq: todo.managerSeq,
              userSeq: userSeq,
              useYn: 'Y',
            },
          });

          await this.sendMessage(
            userInfo.deviceToken,
            `[${todo.todoDay}] ${manager.managerName} 님이`,
            `"${todo.content}"를 ${todo.completeYn === 'Y' ? '완료' : '취소'
            } 했습니다. `,
            `/todo?today=${todo.todoDay}`,
          );
        }
      }
    });
  }
}
