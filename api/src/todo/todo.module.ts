import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyTodo } from './daily-todo.entity';
import { Todo } from './todo.entity';
import { TodoController } from './todo.controller';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([DailyTodo, Todo])],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
