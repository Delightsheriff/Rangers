import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt.auth.guard';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/constants/metadata';

@Injectable()
export class AuthGuard extends JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // Allow pass through if public endpoint
      return true;
    }

    if (!(await super.canActivate(context))) throw new UnauthorizedException();

    // If jwt.auth.guard is activated, extract user from HTTP context
    const user = context.switchToHttp().getRequest()?.user;
    if (!user) throw new UnauthorizedException();

    return true;
  }
}
