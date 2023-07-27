import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { UserVO } from './user.vo';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const logger: Logger = new Logger(AuthUser.name);
    const req: { user: UserVO } = context.switchToHttp().getRequest();
    logger.debug('AuthUser ok ::');
    return req.user;
  },
);
