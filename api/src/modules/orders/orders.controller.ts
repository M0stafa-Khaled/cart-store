import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { AuthGuard } from "../auth/guards/auth.guard";

import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user/current-user.decorator";
import type { User } from "@prisma/client";
import type { Request } from "express";
import { FilterOrderDto } from "./dto/filter-order.dto";

@UseGuards(AuthGuard, RolesGuard)
@Controller("v1/orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * @Docs     User create an order
   * @Route    POST /api/v1/orders/checkout
   * @Access   private [User]
   */
  @HttpCode(HttpStatus.CREATED)
  @Post("checkout")
  create(
    @Req() req: Request,
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() { id: userId }: User,
    @Query("success_url") successUrl?: string,
    @Query("cancel_url") cancelUrl?: string,
  ) {
    const origin = req.headers.origin || req.headers.referer;
    return this.ordersService.create(
      createOrderDto,
      userId,
      successUrl || origin,
      cancelUrl || origin,
    );
  }

  /**
   * @Docs     User get all orders
   * @Route    GET /api/v1/orders
   * @Access   private [User]
   */
  @Get("my-orders")
  findAllUserOrders(
    @Query("sort") sort: "asc" | "desc",
    @Query() filters: FilterOrderDto,
    @CurrentUser() { id: userId }: User,
  ) {
    return this.ordersService.findAllUserOrders(sort, filters, userId);
  }

  /**
   * @Docs     User get an order
   * @Route    GET /api/v1/orders/:id
   * @Access   private [User]
   */
  @Get("my-orders/:id")
  findUserOrder(@Param("id") id: string, @CurrentUser() { id: userId }: User) {
    return this.ordersService.findUserOrder(id, userId);
  }

  /**
   * * ===================================
   * * Admin Routes
   * * ===================================
   */

  /**
   * @Docs     Admin get all orders
   * @Route    GET /api/v1/orders
   * @Access   private [Admin]
   */
  @Roles(["ADMIN"])
  @Get()
  findAll(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("sort") sort: "asc" | "desc",
    @Query() filters: FilterOrderDto,
  ) {
    return this.ordersService.findAll(
      Number(page),
      Number(limit),
      sort,
      filters,
    );
  }

  /**
   * @Docs     Admin get an order
   * @Route    GET /api/v1/orders/:id
   * @Access   private [Admin]
   */
  @Roles(["ADMIN"])
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @Roles(["ADMIN"])
  @Get("user/:userId")
  findAllByUser(
    @Query("sort") sort: "asc" | "desc",
    @Query() filters: FilterOrderDto,
    @Param("userId") userId: string,
  ) {
    return this.ordersService.findAllUserOrders(sort, filters, userId);
  }

  /**
   * @Docs     Admin update an order
   * @Route    PATCH /api/v1/orders/:id
   * @Access   private [Admin]
   */
  @Roles(["ADMIN"])
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }
}
