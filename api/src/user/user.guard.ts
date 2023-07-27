import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { StrategyStorage } from '../auth/strategy-storage';
import { AuthStrategy } from '../auth/auth.strategy';

@Injectable()
export class UserGuard implements CanActivate {
  logger: Logger = new Logger(UserGuard.name);

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization
      ? req.headers.authorization.split('Bearer ')[1]
      : '';

    if (token === '' || token === undefined) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: 'Token Is Not Found.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    req.user = await StrategyStorage.get(AuthStrategy.name).userVerify(token);
    const user = req.user;
    if (!user) {
      return false;
    }

    this.logger.debug('UserGuard ok ::');
    return true;
  }
}
