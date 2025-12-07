import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { CouponsService } from "./coupons.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

import { Roles } from "../auth/decorators/roles.decorator";
import { CouponFilterDto } from "./dto/coupon-filter.dto";
import { Query } from "@nestjs/common";

@UseGuards(AuthGuard, RolesGuard)
@Controller("v1/coupons")
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  /**
   * @Docs     Admin create a new coupon
   * @Route    POST /api/v1/coupons
   * @Access   private [Admin]
   **/
  @Roles(["ADMIN"])
  @Post()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto);
  }

  /**
   * @Docs     Admin get all coupons
   * @Route    GET /api/v1/coupons
   * @Access   private [Admin]
   **/
  @Roles(["ADMIN"])
  @Get()
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("sort") sort: "desc" | "asc" = "desc",
    @Query() filters?: CouponFilterDto,
  ) {
    return this.couponsService.findAll(
      +page! || 1,
      +limit! || 20,
      sort,
      filters,
    );
  }

  /**
   * @Docs     Admin get coupon by id
   * @Route    GET /api/v1/coupons/:id
   * @Access   private [Admin]
   **/
  @Roles(["ADMIN"])
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.couponsService.findOne(id);
  }

  /**
   * @Docs     Admin update coupon by id
   * @Route    PATCH /api/v1/coupons
   * @Access   private [Admin]
   **/
  @Roles(["ADMIN"])
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponsService.update(id, updateCouponDto);
  }

  /**
   * @Docs     Admin delete coupon by id
   * @Route    DELETE /api/v1/coupons/:id
   * @Access   private [Admin]
   **/
  @Roles(["ADMIN"])
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.couponsService.remove(id);
  }
}
