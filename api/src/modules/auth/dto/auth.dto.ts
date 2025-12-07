import {
  IsEmail,
  IsEnum,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from "class-validator";
import { Gender } from "@prisma/client";

export class SignInDto {
  @IsEmail({}, { message: "Invalid email address." })
  email: string;

  @IsString({ message: "Password is required" })
  password: string;
}

export class SignUpDto {
  @MaxLength(50, {
    message: "Name is too long. Maximum length is 50 characters.",
  })
  @MinLength(3, {
    message: "Name is too short. Minimum length is 3 characters.",
  })
  @IsString({ message: "Name is required" })
  name: string;

  @IsEmail({}, { message: "Invalid email address." })
  email: string;

  @MaxLength(24, {
    message: "Password is too long. Maximum length is 24 characters.",
  })
  @MinLength(6, {
    message: "Password is too short. Minimum length is 6 characters.",
  })
  @IsString({ message: "Password is required." })
  password: string;

  @IsEnum(Gender, { message: "Gender must be either 'MALE' or 'FEMALE' " })
  gender: Gender;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: "Invalid email address." })
  email: string;
}

export class ResetPasswordDto {
  @IsString({ message: "OTP is required" })
  @Length(6, 6, { message: "OTP must be 6 characters long." })
  otp: string;

  @IsString({ message: "New password is required." })
  @MinLength(6, {
    message: "Password is too short. Minimum length is 6 characters.",
  })
  @MaxLength(24, {
    message: "Password is too long. Maximum length is 24 characters.",
  })
  password: string;
}
