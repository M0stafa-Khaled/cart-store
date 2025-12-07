import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class FilterCartDto extends PaginationDto {
  @IsString()
  @IsOptional()
  user?: string;

  @IsString()
  @IsOptional()
  coupon?: string;
}
