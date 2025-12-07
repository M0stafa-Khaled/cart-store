import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartsController } from "./cart.controller";

@Module({
  controllers: [CartsController],
  providers: [CartService],
})
export class CartsModule {}
