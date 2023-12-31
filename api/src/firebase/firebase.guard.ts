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
export class FirebaseGuard implements CanActivate {
  logger: Logger = new Logger(FirebaseGuard.name);

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const ftoken = req.headers.authorization
      ? req.headers.authorization.split('Bearer ')[1]
      : '';

    if (ftoken === '' || ftoken === undefined) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: 'Token Is Not Found.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    req.user = await StrategyStorage.get(AuthStrategy.name).fbVerify(ftoken);
    const user = req.user;
    if (!user) {
      return false;
    }

    this.logger.debug('FirebaseGuard ok ::');
    return true;
  }
}
