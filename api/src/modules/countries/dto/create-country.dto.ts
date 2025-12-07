import { IsNotEmpty, IsString } from "class-validator";

export class CreateCountryDto {
  @IsString({ message: "Country name is required." })
  @IsNotEmpty({ message: "Country name is required." })
  name: string;
}
