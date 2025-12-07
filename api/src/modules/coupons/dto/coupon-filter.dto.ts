import { PaginationDto } from "../../../common/dto/pagination.dto";
import { IsOptional, IsString } from "class-validator";

export class CouponFilterDto extends PaginationDto {
  @IsOptional()
  @IsString()
  code?: string;
}
