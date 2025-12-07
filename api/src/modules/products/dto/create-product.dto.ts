import { Transform } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from "class-validator";
import { DiscountType } from "@prisma/client";

export class CreateProductDto {
  @MinLength(3, { message: "Name must be at least 3 characters long." })
  @IsString({ message: "Name is required." })
  @IsNotEmpty({ message: "Name is required." })
  title: string;

  @MinLength(20, {
    message: "Description must be at least 20 characters long.",
  })
  @IsString({ message: "Description is required." })
  @IsNotEmpty({ message: "Description is required." })
  description: string;

  @IsNumber({}, { message: "Stock must be a number." })
  @Min(0, { message: "Stock must be at least 0." })
  @IsNotEmpty({ message: "Stock is required." })
  stock: number;

  @IsOptional()
  imageCover: string;

  @IsOptional()
  images: string[];

  @IsNotEmpty({ message: "Price is required." })
  @IsNumber({}, { message: "Price must be a number." })
  @Min(0, { message: "Price must be at least 0." })
  price: number;

  @IsEnum(DiscountType, {
    message: "Discount type must be 'PERCENTAGE' or 'FIXED'.",
  })
  @IsOptional()
  discountType?: DiscountType;

  @IsOptional()
  @IsNumber({}, { message: "Discount must be a number." })
  @Min(1, { message: "Discount must be at least 1." })
  discountValue?: number;

  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  @IsArray({ message: "Colors must be an array of colors." })
  @IsString({ message: "Colors must be an array of strings.", each: true })
  @IsOptional()
  colors?: string[];

  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  @IsArray({ message: "Sizes must be an array of sizes." })
  @IsString({ message: "Sizes must be an array of strings.", each: true })
  @IsOptional()
  sizes?: string[];

  @IsUUID(undefined, { message: "Category ID must be a valid ID." })
  @IsNotEmpty({ message: "Category ID is required." })
  categoryId: string;

  @IsUUID(undefined, { message: "Subcategory ID must be a valid ID." })
  @IsNotEmpty({ message: "Subcategory ID is required." })
  subCategoryId: string;

  @IsUUID(undefined, { message: "Brand ID must be a valid ID." })
  @IsNotEmpty({ message: "Brand ID is required." })
  brandId: string;
}
