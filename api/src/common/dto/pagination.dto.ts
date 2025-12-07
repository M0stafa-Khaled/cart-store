import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Page must be an integer" })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Limit must be an integer" })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(
    { asc: "asc", desc: "desc" },
    { message: "Sort must be either asc or desc" },
  )
  sort?: "asc" | "desc" = "desc";
}
