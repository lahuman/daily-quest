import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from 'src/user/user.decorator';
import { UserGuard } from 'src/user/user.guard';
import { UserVO } from 'src/user/user.vo';
import { CreateTodoDto, TodoDto } from './todo.dto';
import { TodoService } from './todo.service';
import { TodoVo } from './todo.vo';

@Controller('todo')
@ApiTags('미션 처리')
@UseGuards(UserGuard)
@ApiBearerAuth()
export class TodoController {
  constructor(private readonly service: TodoService) {}

  @ApiOperation({ summary: '미션 작성' })
  @ApiResponse({ status: 201, type: TodoVo })
  @Post()
  async save(@AuthUser() userVo: UserVO, @Body() createTodo: CreateTodoDto) {
    return await this.service.saveTodo(createTodo, userVo.seq);
  }

  @Get('/isHoliday/:dateStr')
  @ApiOperation({ summary: '평일 / 휴일 조회' })
  @ApiResponse({ status: 200, type: TodoVo })
  async getIsHoliday(
    @Param('dateStr') dateStr: string,
  ) {
    return await this.service.isHoliHoliday(dateStr);
  }


  @Get('/:dateStr')
  @ApiOperation({ summary: '미션 목록 조회' })
  @ApiResponse({ status: 200, type: TodoVo })
  async getList4Date(
    @AuthUser() userVo: UserVO,
    @Param('dateStr') dateStr: string,
  ) {
    return await this.service.getTodoList(dateStr, userVo.seq);
  }

  @Delete()
  @ApiOperation({ summary: '미션 삭제' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  async remove(@AuthUser() userVo: UserVO, @Body() todoDto: TodoDto) {
    await this.service.removeTodo(todoDto, userVo.seq);
  }

  @Put()
  @ApiOperation({ summary: '미션 완료/미완료 처리' })
  @ApiResponse({ status: 200 })
  async update(@AuthUser() userVo: UserVO, @Body() todoDto: TodoDto) {
    await this.service.todoComplete(todoDto, userVo.seq);
  }
}
