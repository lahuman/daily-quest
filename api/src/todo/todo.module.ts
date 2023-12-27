import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyTodo } from './daily-todo.entity';
import { Todo } from './todo.entity';
import { TodoController } from './todo.controller';
import { Member } from '../member/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyTodo, Todo, Member])],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
