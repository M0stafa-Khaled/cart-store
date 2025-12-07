import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinDate,
  MinLength,
} from "class-validator";
import { DiscountType } from "@prisma/client";

export class CreateCouponDto {
  @MaxLength(20, { message: "Code must be at most 20 characters long." })
  @MinLength(3, { message: "Code must be at least 3 characters long." })
  @IsString({ message: "Code is required." })
  @IsNotEmpty({ message: "Code cannot be empty." })
  code: string;

  @IsEnum(DiscountType, {
    message: "Discount type must be value of 'PERCENTAGE' or 'FIXED'.",
  })
  @IsOptional()
  discountType?: DiscountType;

  @IsOptional()
  @Min(0, { message: "Discount value must be 0 or more." })
  @IsNumber({}, { message: "Discount value must be a number." })
  discountValue?: number;

  @Min(1, { message: "Max usage must be at least 1." })
  @IsNumber({}, { message: "Max usage must be a number." })
  maxUsage: number;

  @IsOptional()
  @Min(0, { message: "Min order value must be 0 or more." })
  @IsNumber({}, { message: "Min order value must be a number." })
  minOrderValue?: number;

  @IsDate({ message: "Expired at must be a date." })
  @MinDate(new Date(), { message: "Expired at must be a future date." })
  @Transform(({ value }) => new Date(value), {})
  expiredAt: Date;

  @IsBoolean({ message: "isActive must be a boolean." })
  @IsOptional()
  isActive?: boolean;
}
