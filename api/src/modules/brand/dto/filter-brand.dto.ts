import { IsOptional, IsString } from "class-validator";

export class FilterBrandDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @IsOptional()
  sort: string;
}
