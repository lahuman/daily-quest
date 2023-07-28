import { IsNumber } from 'class-validator';

export class UserVO {

  @IsNumber()
  seq: number;
}
