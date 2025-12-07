import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromReq(req);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });
      if (!user || !user.refreshToken) throw new UnauthorizedException();

      req["user"] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromReq(req: Request): string | undefined {
    if (req.cookies?.access_token) {
      return req.cookies.access_token;
    }

    if (req.headers.authorization?.startsWith("Bearer ")) {
      return req.headers.authorization.split(" ")[1];
    }

    return undefined;
  }
}
