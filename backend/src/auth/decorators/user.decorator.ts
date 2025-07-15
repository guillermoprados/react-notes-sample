import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserType {
  id: string;
  email: string;
}

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user: UserType }>();
  return request.user;
});
