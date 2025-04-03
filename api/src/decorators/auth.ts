import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'src/constants/metadata';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // This decorator is used to extract the user from the request object
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
