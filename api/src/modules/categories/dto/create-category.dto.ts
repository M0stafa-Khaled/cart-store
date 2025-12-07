import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
  @MaxLength(50, { message: "Name is too long max characters 50" })
  @MinLength(3, { message: "Name is too short min characters 3" })
  @IsString()
  name: string;

  @IsOptional()
  image: string;
}
