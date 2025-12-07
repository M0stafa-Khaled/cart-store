import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { PaginationDto } from "../../../common/dto/pagination.dto";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

export class FilterOrderDto extends PaginationDto {
  @IsEnum(OrderStatus, {
    message:
      "Status must be one of the following: 'PENDING' or 'COMPLETED' or 'CANCELLED'",
  })
  @IsOptional()
  status?: OrderStatus;

  @IsBoolean({ message: "IsPaid must be a boolean" })
  @IsOptional()
  isPaid?: boolean;

  @IsBoolean({ message: "IsDelivered must be a boolean" })
  @IsOptional()
  isDelivered?: boolean;

  @IsEnum(PaymentStatus, {
    message:
      "Payment status must be one of the following: 'PENDING' or 'PAID' or 'FAILED'",
  })
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @IsEnum(PaymentMethod, {
    message:
      "Payment method must be one of the following: 'CASH' or 'CREDIT_CARD'",
  })
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  user?: string;
}
