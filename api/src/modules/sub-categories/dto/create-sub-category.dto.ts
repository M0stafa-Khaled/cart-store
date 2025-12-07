import { IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateSubCategoryDto {
  @MaxLength(50, { message: "Name is too long max characters 50" })
  @MinLength(3, { message: "Name is too short min characters 3" })
  name: string;

  @IsString({ message: "categoryId is required" })
  @IsUUID(undefined, { message: "Invalid categoryId" })
  categoryId: string;
}
