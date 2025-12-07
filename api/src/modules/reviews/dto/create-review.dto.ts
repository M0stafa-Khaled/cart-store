import { IsInt, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateReviewDto {
  @IsString({ message: "Review is required." })
  reviewText: string;

  @Min(1, { message: "Rating must be a number between 1 and 5." })
  @Max(5, { message: "Rating must be a number between 1 and 5." })
  @IsInt({ message: "Rating must be a integer number." })
  rating: number;

  @IsString({ message: "Product ID is required." })
  @IsUUID(undefined, { message: "Invalid Product ID." })
  productId: string;
}
