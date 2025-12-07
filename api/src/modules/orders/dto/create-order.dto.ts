import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PaymentMethod } from "@prisma/client";

export class CreateOrderDto {
  @IsEnum(PaymentMethod, {
    message:
      "Payment method must be one of the following: 'CASH' or 'CREDIT_CARD'",
  })
  @IsString({ message: "Payment method is required." })
  paymentMethod: PaymentMethod;

  @IsString({ message: "Shipping address ID is required." })
  @IsNotEmpty({ message: "Shipping address ID is required." })
  shippingAddressId: string;
}
