import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum TODO_TYPE {
  T = 'T',
  DT = 'DT',
}

export class CreateTodoDto {
  @ApiProperty({ description: '일일 미션 SEQ', required: false })
  @IsOptional()
  dailyTodoSeq?: number;

  @ApiProperty({ description: '담당자 SEQ', required: false })
  @IsOptional()
  memberSeq?: number;

  @ApiProperty({ description: '포인트', required: false })
  @IsOptional()
  point?: number;


  @ApiProperty({ description: '타입', required: false })
  @IsNotEmpty()
  @IsEnum(Object.values(TODO_TYPE))
  type: TODO_TYPE;

  @ApiProperty({ description: '내용', required: true })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: '실행일', required: true })
  @IsNotEmpty()
  @IsString()
  todoDay: string;

  @ApiProperty({ description: '완료여부', required: false })
  @IsOptional()
  @IsString()
  completeYn: string;

  @ApiProperty({ description: '사용여부', required: false })
  @IsOptional()
  @IsString()
  useYn: string;
}

export class TodoDto {
  @ApiProperty({ description: 'SEQ', required: false })
  @IsOptional()
  seq?: number;

  @ApiProperty({ description: '일일 미션 SEQ', required: false })
  @IsOptional()
  dailyTodoSeq?: number;

  @ApiProperty({ description: '타입', required: false })
  @IsNotEmpty()
  @IsEnum(Object.values(TODO_TYPE))
  type: TODO_TYPE;

  @ApiProperty({ description: '내용', required: true })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: '완료여부', required: false })
  @IsOptional()
  @IsString()
  completeYn: string;

  @ApiProperty({ description: '미션날자', required: true })
  @IsNotEmpty()
  @IsString()
  todoDay: string;
}
