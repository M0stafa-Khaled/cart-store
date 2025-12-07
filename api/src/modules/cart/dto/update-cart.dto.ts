import { IsInt, IsOptional, Min } from "class-validator";

export class UpdateCartDto {
  @Min(1, { message: "Quantity must be at least 1" })
  @IsInt()
  @IsOptional()
  quantity?: number;
}
