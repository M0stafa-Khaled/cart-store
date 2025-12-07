import { IsEnum, IsOptional, IsString } from "class-validator";

export class FilterCountryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEnum(
    { asc: "asc", desc: "desc" },
    { message: "Sort must be either asc or desc" },
  )
  sort?: "asc" | "desc" = "desc";
}
