import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../users/enums/user-role.enum';

export interface AuthUserType {
  id: string;
  email: string;
  role: UserRole;
}

export const AuthUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user: AuthUserType }>();
  return request.user;
});
