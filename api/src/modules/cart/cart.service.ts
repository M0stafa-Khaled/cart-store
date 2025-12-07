import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { FilterCartDto } from "./dto/carts-filter.dto";
import { AddToCartDto } from "./dto/addToCart.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { APIRes } from "../../common/interfaces";
import { Cart } from "@prisma/client";

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  /**
   * @Docs     Add product to cart
   * @Route    POST /api/v1/cart
   * @Access   private [User]
   **/
  async addToCart(
    addToCartDto: AddToCartDto,
    userId: string,
  ): Promise<APIRes<void>> {
    let cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    const product = await this.prisma.product.findUnique({
      where: { id: addToCartDto.productId },
    });
    if (!product) throw new BadRequestException("Product not found");

    if (addToCartDto.color) {
      const colorExists = product.colors?.some(
        (color) =>
          color.toLowerCase() === addToCartDto.color?.toLowerCase() ||
          color === addToCartDto.color,
      );
      if (!colorExists) throw new BadRequestException("Invalid color");
    }

    if (addToCartDto.size) {
      const sizeExists = product.sizes?.some(
        (size) =>
          size.toLowerCase() === addToCartDto?.size?.toLowerCase() ||
          size === addToCartDto.size,
      );
      if (!sizeExists) throw new BadRequestException("Invalid size");
    }

    if (product.sizes.length > 0 && !addToCartDto.size)
      throw new BadRequestException("Size is required");

    if (product.colors.length > 0 && !addToCartDto.color)
      throw new BadRequestException("Color is required");

    const priceAfterDiscount = product.priceAfterDiscount;

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: addToCartDto.productId,
        color: addToCartDto.color,
        size: addToCartDto.size,
      },
    });

    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    const totalRequested = currentQuantityInCart + (addToCartDto.quantity || 1);

    if (totalRequested > product.stock) {
      throw new BadRequestException(
        `Requested quantity not available. Available: ${product.stock - currentQuantityInCart}`,
      );
    }

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: totalRequested,
          total: totalRequested * priceAfterDiscount,
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          price: priceAfterDiscount,
          quantity: addToCartDto.quantity || 1,
          color: addToCartDto.color || null,
          size: addToCartDto.size || null,
          total: priceAfterDiscount * (addToCartDto.quantity || 1),
        },
      });
    }

    await this.recalculateCart(cart.id);

    return {
      success: true,
      message: "Product added to cart successfully",
      data: null,
    };
  }

  /**
   * @Docs     Update cart item
   * @Route    PATCH /api/v1/cart/:id
   * @Access   private [User]
   **/
  async updateCartItem(
    itemId: string,
    userId: string,
    updateCartDto: UpdateCartDto,
  ): Promise<APIRes<void>> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new BadRequestException("Cart not found");

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { product: true },
    });

    if (!cartItem) throw new BadRequestException("Cart item not found");

    const currentQuantityInCart = cartItem.quantity;
    const totalRequested =
      currentQuantityInCart + (updateCartDto.quantity || 1);

    if (totalRequested > cartItem.product.stock) {
      throw new BadRequestException(
        `Requested quantity not available. Available: ${cartItem.product.stock - currentQuantityInCart}`,
      );
    }

    await this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: {
        quantity: updateCartDto.quantity || 1,
        total:
          cartItem.product.priceAfterDiscount * (updateCartDto.quantity || 1),
      },
    });

    await this.recalculateCart(cart.id);
    return {
      success: true,
      message: "Product updated in cart successfully",
      data: null,
    };
  }

  /**
   * @Docs     Remove cart item
   * @Route    DELETE /api/v1/cart/:id
   * @Access   private [User]
   **/
  async removeCartItem(itemId: string, userId: string): Promise<APIRes<void>> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new BadRequestException("Cart not found");

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    await this.recalculateCart(cart.id);

    return {
      success: true,
      message: "Product removed from cart successfully",
      data: null,
    };
  }

  /**
   * @Docs     Get user cart
   * @Route    GET /api/v1/cart
   * @Access   private [User]
   **/
  async findOne(userId: string): Promise<APIRes<Partial<Cart>>> {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        coupon: true,
        cartItems: {
          include: { product: true },
          omit: { cartId: true, productId: true },
        },
      },
      omit: { userId: true, couponId: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          coupon: true,
          cartItems: {
            include: { product: true },
            omit: { cartId: true, productId: true },
          },
        },
        omit: { userId: true, couponId: true },
      });
    }

    return {
      success: true,
      message: null,
      data: cart,
    };
  }

  /**
   * @Docs     Get all carts
   * @Route    GET /api/v1/cart/users
   * @Access   private [Admin]
   **/
  async findAll(
    page: number = 1,
    limit: number = 20,
    sort: "desc" | "asc" = "desc",
    filters?: FilterCartDto,
  ): Promise<APIRes<Partial<Cart>[]>> {
    if (sort !== "asc" && sort !== "desc") sort = "desc";

    page = Number(page) || 1;
    limit = Number(limit) || 20;

    const where: any = {};

    if (filters) {
      if (filters.user)
        where.user = {
          name: { contains: filters.user, mode: "insensitive" },
        };
      if (filters.coupon)
        where.coupon = {
          coupon: {
            code: { contains: filters.coupon, mode: "insensitive" },
          },
        };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.cart.findMany({
        where,
        include: {
          coupon: true,
          user: {
            omit: { password: true, refreshToken: true },
          },
          cartItems: {
            include: { product: true },
            omit: { cartId: true, productId: true },
          },
        },
        omit: { userId: true, couponId: true },
        skip: (page - 1) * limit || 0,
        take: limit,
        orderBy: { createdAt: sort },
      }),
      this.prisma.cart.count(),
    ]);
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: null,
      data: {
        items: data,
        meta: {
          count: data.length,
          limit,
          page,
          total,
          totalPages,
          hasPrevPage: page < totalPages,
          hasNextPage: page > 1,
        },
      },
    };
  }

  /**
   * @Docs     Admin get user cart
   * @Route    GET /api/v1/cart/user/:userId
   * @Access   private [Admin]
   **/
  async findUserCart(userId: string): Promise<APIRes<Partial<Cart>>> {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        coupon: true,
        user: {
          omit: { password: true, refreshToken: true },
        },
        cartItems: {
          include: { product: true },
          omit: { cartId: true, productId: true },
        },
      },
      omit: { userId: true, couponId: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          coupon: true,
          user: {
            omit: { password: true, refreshToken: true },
          },
          cartItems: {
            include: { product: true },
            omit: { cartId: true, productId: true },
          },
        },
        omit: { userId: true, couponId: true },
      });
    }

    return {
      success: true,
      message: null,
      data: cart,
    };
  }

  /**
   * @Docs     Apply coupon
   * @Route    POST /api/v1/cart/coupon/apply
   * @Access   private [User]
   **/
  async applyCoupon(userId: string, code: string): Promise<APIRes<any>> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new BadRequestException("Cart not found");

    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.isActive || coupon.expiredAt < new Date()) {
      throw new BadRequestException("Invalid or expired coupon");
    }

    if (coupon.usedCount >= coupon.maxUsage)
      throw new BadRequestException("Coupon is already used or expired.");

    if (cart.couponId) throw new BadRequestException("Coupon already applied");

    if (coupon.minOrderValue && cart.subTotal < coupon.minOrderValue)
      throw new BadRequestException("Cart total does not meet coupon minimum");

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { couponId: coupon.id },
    });

    await this.recalculateCart(cart.id);
    return {
      success: true,
      message: "Coupon applied successfully",
      data: null,
    };
  }

  /**
   * @Docs     Remove coupon
   * @Route    DELETE /api/v1/cart/coupon/remove
   * @Access   private [User]
   **/
  async removeCoupon(userId: string): Promise<APIRes<any>> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new BadRequestException("Cart not found");

    if (!cart.couponId) throw new BadRequestException("Coupon not applied");

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { couponId: null, discount: 0 },
    });

    await this.recalculateCart(cart.id);
    return {
      success: true,
      message: "Coupon removed successfully",
      data: null,
    };
  }

  /**
   * @Docs     Recalculate cart
   **/
  private async recalculateCart(cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { coupon: true, cartItems: true },
    });
    if (!cart) throw new BadRequestException("Cart not found");

    const subTotal = cart.cartItems.reduce((sum, i) => sum + i.total, 0);
    let discount = 0;

    if (cart.coupon) {
      if (
        cart.coupon.discountType === "PERCENTAGE" &&
        cart.coupon.discountValue
      ) {
        discount = (subTotal * cart.coupon.discountValue) / 100;
      } else if (
        cart.coupon.discountType === "FIXED" &&
        cart.coupon.discountValue
      ) {
        discount = cart.coupon.discountValue;
      }
    }

    const totalPrice = subTotal - discount;

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { subTotal, discount, totalPrice },
    });
  }
}
