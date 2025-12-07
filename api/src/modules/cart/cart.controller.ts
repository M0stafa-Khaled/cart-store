import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { AddToCartDto } from "./dto/addToCart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { ApplyCouponDto } from "./dto/apply-coupon.dto";
import { CurrentUser } from "../../common/decorators/current-user/current-user.decorator";
import type { User } from "@prisma/client";

@UseGuards(AuthGuard, RolesGuard)
@Controller("v1/cart")
export class CartsController {
  constructor(private readonly cartService: CartService) {}

  /**
   * @Docs     Add product to cart
   * @Route    POST /api/v1/cart
   * @Access   private [User]
   **/
  @HttpCode(HttpStatus.OK)
  @Post()
  addToCart(
    @Body() createCartDto: AddToCartDto,
    @CurrentUser() { id: userId }: User,
  ) {
    return this.cartService.addToCart(createCartDto, userId);
  }

  /**
   * @Docs     Update cart item
   * @Route    PATCH /api/v1/cart/:itemId
   * @Access   private [User]
   **/
  @Patch(":itemId")
  updateCartItem(
    @Param("itemId") itemId: string,
    @CurrentUser() { id: userId }: User,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.updateCartItem(itemId, userId, updateCartDto);
  }

  /**
   * @Docs     Remove cart item
   * @Route    DELETE /api/v1/cart/:itemId
   * @Access   private [User]
   **/
  @Delete(":itemId")
  removeCartItem(
    @Param("itemId") itemId: string,
    @CurrentUser() { id: userId }: User,
  ) {
    return this.cartService.removeCartItem(itemId, userId);
  }

  /**
   * @Docs     Get user cart
   * @Route    GET /api/v1/cart
   * @Access   private [User]
   **/
  @Get()
  findOne(@CurrentUser() { id: userId }: User) {
    return this.cartService.findOne(userId);
  }

  // /**
  //  * @Docs     Get all carts
  //  * @Route    GET /api/v1/cart/users
  //  * @Access   private [Admin]
  //  **/
  // @Roles(["ADMIN"])
  // @Get("users")
  // findAll(
  //   @Query("page") page: number,
  //   @Query("limit") limit: number,
  //   @Query("sort") sort: "desc" | "asc",
  //   @Query() filters: FilterCartDto,
  // ) {
  //   return this.cartService.findAll(page, limit, sort, filters);
  // }

  // /**
  //  * @Docs     Admin get user cart
  //  * @Route    GET /api/v1/cart/users/:userId
  //  * @Access   private [Admin]
  //  **/
  // @Roles(["ADMIN"])
  // @Get("users/:userId")
  // findUserCart(@Param("userId") userId: string) {
  //   return this.cartService.findUserCart(userId);
  // }

  /**
   * @Docs     Apply coupon
   * @Route    POST /api/v1/cart/coupon/apply
   * @Access   private [User]
   **/
  @HttpCode(HttpStatus.OK)
  @Post("coupon/apply")
  applyCoupon(
    @CurrentUser() { id: userId }: User,
    @Body() { code }: ApplyCouponDto,
  ) {
    return this.cartService.applyCoupon(userId, code);
  }

  /**
   * @Docs     Remove coupon
   * @Route    DELETE /api/v1/cart/coupon/remove
   * @Access   private [User]
   **/
  @Delete("coupon/remove")
  removeCoupon(@CurrentUser() { id: userId }: User) {
    return this.cartService.removeCoupon(userId);
  }
}
