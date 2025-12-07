import { PaginationDto } from "../../../common/dto/pagination.dto";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class FilterReviewDto extends PaginationDto {
  @IsString()
  @IsOptional()
  user?: string;

  @IsString()
  @IsOptional()
  product?: string;

  @Min(0)
  @IsInt()
  @IsOptional()
  minRating: number;

  @Max(5)
  @IsInt()
  @IsOptional()
  maxRating: number;
}
