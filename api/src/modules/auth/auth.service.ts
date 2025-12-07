import bcrypt from "bcrypt";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from "./dto/auth.dto";
import { APIRes } from "../../common/interfaces";
import * as crypto from "crypto";
import { EmailService } from "../../email/email.service";
import { User } from "@prisma/client";

export interface AuthRes extends Tokens {
  user: Partial<User>;
}

type Tokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

interface JWTPayload {
  id: string;
  role: string;
  email: string;
  active: boolean;
  isVerified: boolean;
}
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  /**
   * @Docs     User login
   * @Route    POST /api/v1/auth/sign-in
   * @Access   Public
   **/
  async signIn(data: SignInDto): Promise<APIRes<AuthRes>> {
    const existsUser = await this.prisma.user.findUnique({
      where: { email: data.email },
      omit: {
        refreshToken: true,
      },
    });

    if (!existsUser) throw new UnauthorizedException("Invalid credentials");

    // Check if user is active
    if (!existsUser.active) {
      throw new UnauthorizedException("Account is deactivated");
    }

    const isValidPass = await bcrypt.compare(
      data.password,
      existsUser.password,
    );

    if (!isValidPass) throw new UnauthorizedException("Invalid credentials");

    if (!existsUser.isVerified) {
      throw new UnauthorizedException(
        "Email verification required. Please check your email to verify your account.",
      );
    }

    // login user
    const tokens = await this.generateAuthTokens({
      id: existsUser.id,
      role: existsUser.role,
      email: existsUser.email,
      active: existsUser.active,
      isVerified: existsUser.isVerified,
    });

    const { password, ...user } = existsUser;

    // update refresh token
    await this.updateRefreshToken(existsUser.id, tokens.refreshToken);

    return {
      success: true,
      message: "Login successfully",
      data: {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
    };
  }

  /**
   * @Docs     User register
   * @Route    POST /api/v1/auth/sign-up
   * @Access   Public
   **/
  async signUp(data: SignUpDto): Promise<APIRes<{ user: Partial<User> }>> {
    const existsEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existsEmail)
      throw new ConflictException("Email has been already taken.");

    // create a new user
    const slat = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, slat);

    const newUser = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    const tokens = await this.generateAuthTokens({
      id: newUser.id,
      role: newUser.role,
      email: newUser.email,
      active: newUser.active,
      isVerified: newUser.isVerified,
    });

    const { password, ...user } = newUser;

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const verificationToken = this.generateVerificationToken();
    // send verification url to user email
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        verificationToken,
      );
    } catch (error) {
      console.log("Failed to send verification email");
    }

    // store otp in db
    await this.prisma.verificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        type: "EMAIL_VERIFICATION",
        expiresAt,
      },
    });

    // update refresh token
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    return {
      success: true,
      message:
        "Sign up successfully, please check your email to verify your account",
      data: {
        user,
      },
    };
  }

  /**
   * @Docs     User logout
   * @Route    POST /api/v1/auth/logout
   * @Access   Private ["admin", "user"]
   **/
  async logout(userId: string): Promise<APIRes<void>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException("User not found");

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return {
      success: true,
      message: "Logged out successfully",
      data: null,
    };
  }

  /**
   * @Docs     User refresh token
   * @Route    POST /api/v1/auth/refresh-token
   * @Access   Private ["admin", "user"]
   **/
  async refreshToken(refreshToken: string) {
    // Verify refresh token
    if (!refreshToken)
      throw new UnauthorizedException("Refresh token required");

    let payload: JWTPayload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch (err) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) throw new UnauthorizedException("Invalid refresh token");

    const tokens = await this.generateAuthTokens({
      id: user.id,
      role: user.role,
      email: user.email,
      active: user.active,
      isVerified: user.isVerified,
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      success: true,
      message: "Refresh token successfully",
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
    };
  }

  /**
   * @Docs     User forgot password
   * @Route    POST /api/v1/auth/forgot-password
   * @Access   Public
   **/
  async forgotPassword(data: ForgotPasswordDto): Promise<APIRes<void>> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) throw new NotFoundException("User not found");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    const otp = this.generateOTP(6);
    // send verification url to user email
    try {
      await this.emailService.sendResetPasswordEmail(user.email, otp);
    } catch (error) {
      console.log("Failed to send verification email");
    }
    // store otp in db
    await this.prisma.verificationToken.create({
      data: {
        token: otp,
        userId: user.id,
        type: "RESET_PASSWORD",
        expiresAt,
      },
    });

    return {
      success: true,
      message: "The verification code has been sent to your email.",
      data: null,
    };
  }

  /**
   * @Docs     User reset password
   * @Route    POST /api/v1/auth/reset-password
   * @Access   Public
   **/
  async resetPassword(data: ResetPasswordDto): Promise<APIRes<void>> {
    const verificationCode = await this.prisma.verificationToken.findFirst({
      where: {
        token: data.otp,
        type: "RESET_PASSWORD",
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!verificationCode)
      throw new NotFoundException("Invalid or expired OTP code.");

    const slat = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, slat);

    await this.prisma.user.update({
      where: { id: verificationCode.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.verificationToken.update({
      where: { id: verificationCode.id },
      data: { used: true },
    });

    return {
      success: true,
      message: "Password has been reset successfully.",
      data: null,
    };
  }

  /**
   * @Docs     User verify email
   * @Route    POST /api/v1/auth/verify-email
   * @Access   Private ["admin", "user"]
   **/
  async verifyEmail(token: string): Promise<APIRes<null>> {
    const verificationToken = await this.prisma.verificationToken.findFirst({
      where: {
        token,
        type: "EMAIL_VERIFICATION",
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: verificationToken?.userId },
    });

    if (!verificationToken || !user)
      throw new BadRequestException("Invalid or expired verification url.");

    await this.prisma.user.update({
      where: { id: verificationToken.userId },
      data: { isVerified: true },
    });

    await this.prisma.verificationToken.update({
      where: { id: verificationToken.id },
      data: { used: true },
    });

    return {
      success: true,
      message: "Email verified successfully",
      data: null,
    };
  }

  // /**
  //  * @Docs     User resend verification code
  //  * @Route    POST /api/v1/auth/resend-verification-code
  //  * @Access   Private ["admin", "user"]
  //  **/
  async resendVerificationCode(email: string): Promise<APIRes<void>> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new NotFoundException("User not found");

    if (user.isVerified)
      throw new ConflictException("Email is already verified.");

    await this.prisma.verificationToken.deleteMany({
      where: { userId: user.id, type: "EMAIL_VERIFICATION", used: false },
    });

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const verificationToken = this.generateVerificationToken();
    // send verification url to user email
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        verificationToken,
      );
    } catch (error) {
      console.log("Failed to send verification email");
    }
    // store otp in db
    await this.prisma.verificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        type: "EMAIL_VERIFICATION",
        expiresAt,
      },
    });

    return {
      success: true,
      message: "The verification email has been sent to your email.",
      data: null,
    };
  }

  async checkAuth(user: User): Promise<APIRes<{ auth: boolean }>> {
    if (!user)
      return {
        success: false,
        message: "User not authenticated",
        data: {
          auth: false,
        },
      };

    const existsUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existsUser)
      return {
        success: false,
        message: "User not authenticated",
        data: {
          auth: false,
        },
      };

    return {
      success: true,
      message: "User authenticated successfully",
      data: {
        auth: true,
      },
    };
  }

  /**
   * @Docs Generate verification token
   **/
  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * @Docs Generate otp for reset password
   */
  private generateOTP(length = 6) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  /**
   * @Docs  Generate tokens
   **/
  private async generateAuthTokens(payload: JWTPayload): Promise<Tokens> {
    const accessTokenExpiresIn = Number(process.env.ACCESS_TOKEN_EXPIRES);
    const refreshTokenExpiresIn = Number(process.env.REFRESH_TOKEN_EXPIRES);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: accessTokenExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: refreshTokenExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiresIn,
    };
  }

  /**
   * @Docs  Update refresh token
   **/
  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hashedRefresh = await bcrypt.hash(refreshToken, salt);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefresh },
    });
  }
}
