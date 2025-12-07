import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class AddToCartDto {
  @IsUUID(undefined, { message: "Invalid Product ID." })
  @IsString({ message: "Product ID is required." })
  @IsNotEmpty({ message: "Product ID is required." })
  productId: string;

  @IsInt()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  size?: string;
}
