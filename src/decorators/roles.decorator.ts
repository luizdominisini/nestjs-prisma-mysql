import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enums/role.enum';

export const ROLES_KEYS = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEYS, roles);
