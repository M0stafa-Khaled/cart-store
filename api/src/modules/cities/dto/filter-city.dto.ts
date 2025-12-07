import { IsOptional, IsString, IsEnum } from "class-validator";

export class FilterCityDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsOptional()
  @IsEnum(
    { asc: "asc", desc: "desc" },
    { message: "Sort must be either asc or desc" },
  )
  sort?: "asc" | "desc" = "desc";
}
