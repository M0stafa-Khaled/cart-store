import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get("roles", context.getHandler());

    if (!roles) return true;

    const req = context.switchToHttp().getRequest();

    if (!req?.user || !roles.includes(req.user.role)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
