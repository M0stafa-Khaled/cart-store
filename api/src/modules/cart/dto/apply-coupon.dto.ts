import { IsNotEmpty, IsString } from "class-validator";

export class ApplyCouponDto {
  @IsString({ message: "Coupon code is required" })
  @IsNotEmpty({ message: "Coupon code is required" })
  code: string;
}
