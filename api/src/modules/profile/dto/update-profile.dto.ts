import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @MaxLength(24, {
    message: "Password is too long. Maximum length is 24 characters.",
  })
  @MinLength(6, {
    message: "Password is too short. Minimum length is 6 characters.",
  })
  @IsString()
  password?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  @MaxLength(14, {
    message: "Phone number is too long. Maximum length is 14 characters.",
  })
  @IsPhoneNumber("EG", { message: "Invalid phone number." })
  @IsString({ message: "Phone is required." })
  phone?: string;
}
