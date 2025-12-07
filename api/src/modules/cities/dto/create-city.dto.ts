import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateCityDto {
  @IsString({ message: "City name is required." })
  @IsNotEmpty({ message: "City name is required." })
  name: string;

  @IsUUID(undefined, { message: "Invalid Country ID." })
  @IsString({ message: "Country ID is required." })
  countryId: string;

  @IsNumber({}, { message: "Shipping price is required." })
  @IsNotEmpty({ message: "Shipping price is required." })
  shippingPrice: number;
}
