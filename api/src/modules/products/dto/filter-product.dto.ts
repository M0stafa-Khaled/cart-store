import { PaginationDto } from "../../../common/dto/pagination.dto";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class FilterProductDto extends PaginationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  subCategory?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsEnum({ true: "true", false: "false" })
  @IsOptional()
  reviews?: "true" | "false";

  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @IsString()
  @IsOptional()
  search?: string;
}
