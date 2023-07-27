import { Expose } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';

export class RefreshHeaderDTO {
  @IsString()
  @IsDefined()
  @Expose({ name: 'authorization' })
  authorization: string;
}
