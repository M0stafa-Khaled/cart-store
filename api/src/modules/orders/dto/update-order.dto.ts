import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { OrderStatus } from "@prisma/client";

export class UpdateOrderDto {
  @IsEnum(OrderStatus, {
    message: "Status must be one of the following: 'COMPLETED' or 'CANCELLED'",
  })
  @IsOptional()
  status?: OrderStatus;

  @IsBoolean({ message: "IsDelivered must be a boolean" })
  @IsOptional()
  isDelivered?: boolean;
}
