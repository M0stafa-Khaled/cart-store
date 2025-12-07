import { Gender, Role } from "@prisma/client";
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsBoolean,
} from "class-validator";

export class CreateUserDto {
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

  @IsEnum(Role, { message: "Role must be either 'USER' or 'ADMIN'." })
  @IsOptional()
  role?: Role;

  @IsOptional()
  @MaxLength(14, {
    message: "Phone number is too long. Maximum length is 14 digits.",
  })
  @MinLength(10, {
    message: "Phone number is too short. Minimum length is 10 digits.",
  })
  @IsString({ message: "Phone is required." })
  phone?: string;

  @IsOptional()
  avatar?: string;

  @IsEnum(Gender, { message: "Gender must be either 'MALE' or 'FEMALE' " })
  gender: Gender;

  @IsBoolean({ message: "isActive must be a boolean." })
  @IsOptional()
  active?: boolean;
}
