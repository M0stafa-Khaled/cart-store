import { IsOptional, IsString } from "class-validator";

export class FilterSubCategory {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sort?: string;

  @IsString()
  @IsOptional()
  category?: string;
}
