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
} from "@nestjs/common";
import { ShippingAddressesService } from "./shipping-addresses.service";
import { CreateShippingAddressDto } from "./dto/create-shipping-address.dto";
import { UpdateShippingAddressDto } from "./dto/update-shipping-address.dto";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CurrentUser } from "../../common/decorators/current-user/current-user.decorator";
import type { User } from "@prisma/client";

@UseGuards(AuthGuard)
@Controller("v1/shipping-addresses")
export class ShippingAddressesController {
  constructor(
    private readonly shippingAddressesService: ShippingAddressesService,
  ) {}

  /**
   * @Docs     Create shipping address
   * @Route    POST /api/v1/shipping-addresses
   * @Access   Private [user]
   **/
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body() createShippingAddressDto: CreateShippingAddressDto,
    @CurrentUser() { id: userId }: User,
  ) {
    return this.shippingAddressesService.create(
      createShippingAddressDto,
      userId,
    );
  }

  /**
   * @Docs     Get all shipping addresses
   * @Route    GET /api/v1/shipping-addresses
   * @Access   Private [user]
   **/
  @Get()
  findAll(@CurrentUser() { id: userId }: User) {
    return this.shippingAddressesService.findAll(userId);
  }

  /**
   * @Docs     Get shipping address by id
   * @Route    GET /api/v1/shipping-addresses/:id
   * @Access   Private [user]
   **/
  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser() { id: userId }: User) {
    return this.shippingAddressesService.findOne(id, userId);
  }

  /**
   * @Docs     Update shipping address
   * @Route    PATCH /api/v1/shipping-addresses/:id
   * @Access   Private [user]
   **/
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateShippingAddressDto: UpdateShippingAddressDto,
    @CurrentUser() { id: userId }: User,
  ) {
    return this.shippingAddressesService.update(
      id,
      updateShippingAddressDto,
      userId,
    );
  }

  /**
   * @Docs     Delete shipping address
   * @Route    DELETE /api/v1/shipping-addresses/:id
   * @Access   Private [user]
   **/
  @Delete(":id")
  remove(@Param("id") id: string, @CurrentUser() { id: userId }: User) {
    return this.shippingAddressesService.remove(id, userId);
  }
}
