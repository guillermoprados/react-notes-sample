import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { UserRole } from '../../users/enums/user-role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';

export const OnlyAdmins = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    SetMetadata(ROLES_KEY, [UserRole.ADMIN]),
  );
