import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUserType {
  id: string;
  email: string;
}

export const AuthUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user: AuthUserType }>();
  return request.user;
});
