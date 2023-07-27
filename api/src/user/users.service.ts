import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserVO } from './user.vo';
import { UserTokenVo } from './user-token.vo';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'lahumanJwtToken';
const JWT_REFRESH_SECRET = 'lahumanJwtRefreshToken';

@Injectable()
export class UserService {
  logger: Logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  tokenValidate(token: string): UserTokenVo {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Token is invalid.', HttpStatus.UNAUTHORIZED);
    }
  }

  async tokenRefresh(refresh: string): Promise<UserTokenVo> {
    try {
      const decode = jwt.verify(refresh, JWT_REFRESH_SECRET);
      const user = await this.userRepository.findOneOrFail(decode.seq);

      return this.makeUserTokenVO(user);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Token is invalid.', HttpStatus.FORBIDDEN);
    }
  }

  private makeUserTokenVO(user: User): UserTokenVo {
    const token = jwt.sign(
      {
        ...user,
      },
      JWT_SECRET,
      {
        expiresIn: 60 * 60 * 1, // 1시간 valid
      },
    );
    const refresh = jwt.sign(
      {
        ...user,
      },
      JWT_REFRESH_SECRET,
      {
        expiresIn: 60 * 60 * 24 * 3, // 3일간 valid
      },
    );

    return { token, refresh };
  }

  async signIn(firebaseUser: DecodedIdToken): Promise<UserTokenVo> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { uid: firebaseUser.uid },
      });
      return this.makeUserTokenVO(user);
    } catch (e) {
      const user = await this.userRepository.save(
        new User({ uid: firebaseUser.uid, email: firebaseUser.email }),
      );
      return this.makeUserTokenVO(user);
    }
  }
}
