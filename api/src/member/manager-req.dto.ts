import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ManagerReqDto {
  @ApiProperty({ description: 'seq' })
  @IsOptional()
  @IsNumber()
  seq?: number;

  @ApiProperty({ description: '요청자SEQ', required: false })
  @IsNumber()
  userSeq?: number;

  @ApiProperty({ description: '관리자SEQ', required: true })
  @IsNotEmpty()
  @IsNumber()
  managerSeq: number;

  @ApiProperty({ description: '승락여부' })
  @IsString()
  acceptYn: string;
}
