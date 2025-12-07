import { IsOptional, IsString, IsBoolean, IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { PaginationDto } from "../../../common/dto/pagination.dto";
import { Role } from "@prisma/client";

export class FilterUserDto extends PaginationDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsEnum(Role, { message: "Role must be either ADMIN or USER" })
  role?: Role;

  @IsBoolean({ message: "Active must be a boolean" })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === "string") return value.toLowerCase() === "true";

    return Boolean(value);
  })
  active?: boolean;

  @IsBoolean({ message: "IsVerified must be a boolean" })
  @IsOptional()
  isVerified?: boolean;
}
