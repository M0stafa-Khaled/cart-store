import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import type { Request as ExpressRequest } from "express";
import { AuthService } from "./auth.service";
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from "./dto/auth.dto";
import { AuthGuard } from "./guards/auth.guard";
import { CurrentUser } from "../../common/decorators/current-user/current-user.decorator";
import type { User } from "@prisma/client";
import { minutes, Throttle } from "@nestjs/throttler";

@Controller("v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @Docs     User login
   * @Route    POST /api/v1/auth/sign-in
   * @Access   Public
   **/
  @Post("sign-in")
  @Throttle({
    default: { limit: 3, ttl: minutes(1), blockDuration: minutes(1) },
  })
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  /**
   * @Docs     User register
   * @Route    POST /api/v1/auth/sign-up
   * @Access   Public
   **/
  @HttpCode(HttpStatus.CREATED)
  @Throttle({
    default: { limit: 3, ttl: minutes(1), blockDuration: minutes(1) },
  })
  @Post("sign-up")
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
  /**
   * @Docs     Refresh access token
   * @Route    POST /api/v1/auth/refresh-token
   * @Access   Public (No AuthGuard)
   **/
  @HttpCode(HttpStatus.OK)
  @Throttle({
    default: { limit: 3, ttl: minutes(1), blockDuration: minutes(1) },
  })
  @Post("refresh-token")
  async refreshToken(@Request() req: ExpressRequest) {
    const refreshToken =
      req.cookies.refresh_token || req.headers["x-refresh-token"];
    return await this.authService.refreshToken(refreshToken);
  }

  /**
   * @Docs     Logout user (clear cookies)
   * @Route    POST /api/v1/auth/logout
   * @Access   Private
   **/
  @UseGuards(AuthGuard)
  @Throttle({
    default: { limit: 3, ttl: minutes(1), blockDuration: minutes(1) },
  })
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  /**
   * @Docs     Verify email
   * @Route    POST /api/v1/auth/verify-email
   * @Access   Private
   **/
  @Post("verify-email")
  @Throttle({
    default: { limit: 3, ttl: minutes(1), blockDuration: minutes(1) },
  })
  verifyEmail(@Query("token") token: string) {
    return this.authService.verifyEmail(token);
  }

  // /**
  //  * @Docs     Resend verification code
  //  * @Route    POST /api/v1/auth/resend-verification-code
  //  * @Access   Private
  //  **/
  // @HttpCode(HttpStatus.OK)
  // @Post("resend-verification-code")
  // resendVerificationCode(@CurrentUser() user: User) {
  //   return this.authService.resendVerificationCode(user.email);
  // }

  /**
   * @Docs     Forgot password
   * @Route    POST /api/v1/auth/forgot-password
   * @Access   Public
   **/
  @HttpCode(HttpStatus.OK)
  @Throttle({
    default: { limit: 3, ttl: minutes(1), blockDuration: minutes(1) },
  })
  @Post("forgot-password")
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  /**
   * @Docs     Reset password
   * @Route    POST /api/v1/auth/reset-password
   * @Access   Public
   **/
  @HttpCode(HttpStatus.OK)
  @Throttle({
    default: { limit: 3, ttl: minutes(1), blockDuration: minutes(1) },
  })
  @Post("reset-password")
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(AuthGuard)
  @Post("check-auth")
  @HttpCode(HttpStatus.OK)
  checkAuth(@CurrentUser() user: User) {
    return this.authService.checkAuth(user);
  }
}
