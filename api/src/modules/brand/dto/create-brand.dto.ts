import { IsOptional, IsString } from "class-validator";

export class CreateBrandDto {
  @IsString({ message: "Brand name is required." })
  name: string;

  @IsOptional()
  image: string;
}
