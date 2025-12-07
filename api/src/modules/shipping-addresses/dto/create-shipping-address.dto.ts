import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateShippingAddressDto {
  @IsString({ message: "Address is required." })
  @IsNotEmpty({ message: "Address is required." })
  address: string;

  @MaxLength(14, {
    message: "Invalid phone number.",
  })
  @MinLength(10, {
    message: "Phone number is too short. Minimum length is 10 digits.",
  })
  @IsString({ message: "Phone is required." })
  @IsNotEmpty({ message: "Phone is required." })
  phone: string;

  @IsUUID(undefined, { message: "Invalid city ID." })
  @IsString({ message: "City ID is required." })
  @IsNotEmpty({ message: "City ID is required." })
  cityId: string;

  @IsUUID(undefined, { message: "Invalid country ID." })
  @IsNotEmpty({ message: "Country ID is required." })
  countryId: string;
}
