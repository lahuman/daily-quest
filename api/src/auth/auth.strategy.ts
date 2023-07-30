import { Injectable } from '@nestjs/common';
import { UserService } from '../user/users.service';
import { StrategyStorage } from './strategy-storage';
import { UserTokenVo } from '../user/user-token.vo';
import { FirebaseService } from '../firebase/firebase.service';
import { UserVO } from '..//user/user.vo';

@Injectable()
export class AuthStrategy {
  constructor(
    private userService: UserService,
    private firebaseService: FirebaseService,
  ) {
    StrategyStorage.set(AuthStrategy.name, this);
  }

  fbVerify(token: string) {
    return this.firebaseService.authTokenVerify(token);
  }
  userVerify(token: string): UserVO {
    return this.userService.tokenValidate(token);
  }
}
