import { SetMetadata } from '@nestjs/common';
import { USER_ROLE } from './role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: USER_ROLE[]) => SetMetadata(ROLES_KEY, roles);
