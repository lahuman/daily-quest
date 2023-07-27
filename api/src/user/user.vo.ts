import { User } from './user.entity';

export class UserVO {
  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
  seq: number;
  email: string;
  uid: string;
  regDtm: Date;
  modDtm: Date;
}
