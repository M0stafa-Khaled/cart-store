import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { APIRes } from "../../common/interfaces";
import { Order } from "@prisma/client";
import { IShippingAddress } from "./interfaces/shipping-address.interface";
import Stripe from "stripe";
import { FilterOrderDto } from "./dto/filter-order.dto";
import { EmailService } from "../../email/email.service";

export interface CreateOrderRes {
  order: Partial<Order>;
  checkoutUrl?: string;
}

interface FindOrdersOptions {
  page: number;
  limit: number;
  sort: "asc" | "desc";
  filters: FilterOrderDto;
  userId?: string;
}

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
  });

  /**
   * @Docs     User create an order
   * @Route    POST /api/v1/orders/checkout
   * @Access   private [User]
   */
  async create(
    createOrderDto: CreateOrderDto,
    userId: string,
    successUrl?: string,
    cancelUrl?: string,
  ): Promise<APIRes<CreateOrderRes | Partial<Order>>> {
    // Check if cart exists
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true, coupon: true },
    });
    if (!cart) throw new NotFoundException("Cart not found.");

    // Check if shipping address exists
    const shippingAddress = await this.prisma.shippingAddress.findUnique({
      where: { id: createOrderDto.shippingAddressId, userId },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
      omit: { cityId: true, userId: true },
    });
    if (!shippingAddress)
      throw new NotFoundException("Shipping address not found.");

    // Check if cart is empty
    if (cart.cartItems.length === 0)
      throw new BadRequestException("Cart is empty.");

    // Check if product quantity is available
    for (const item of cart.cartItems) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product)
        throw new NotFoundException(`Product ${item.productId} not found.`);
      if (product.stock < item.quantity)
        throw new BadRequestException(
          `Not enough stock for ${product.title}. Available: ${product.stock}`,
        );
    }

    // Order creation process
    const order = await this.prisma.$transaction(async (tx) => {
      // Create a new order
      const createdOrder = await tx.order.create({
        data: {
          orderNumber: "TEMP",
          userId,
          subTotal: cart.subTotal,
          totalPrice: cart.totalPrice + shippingAddress.city.shippingPrice,
          discount: cart.discount,
          shippingCost: shippingAddress.city.shippingPrice,
          couponId: cart.couponId,
          paymentMethod: createOrderDto.paymentMethod,
          shippingAddress,
          orderItems: {
            create: cart.cartItems.map((item) => ({
              productId: item.productId,
              price: item.price,
              quantity: item.quantity,
              total: item.total,
              color: item.color,
              size: item.size,
            })),
          },
        },
        include: {
          coupon: true,
          user: true,
          orderItems: {
            include: { product: true },
            omit: { productId: true, orderId: true },
          },
        },
        omit: { couponId: true, userId: true },
      });

      const order = await this.prisma.order.update({
        where: { id: createdOrder.id },
        data: {
          orderNumber: this.generateOrderNumber(createdOrder.id, userId),
        },
        include: {
          coupon: true,
          user: true,
          orderItems: {
            include: { product: true },
            omit: { productId: true, orderId: true },
          },
        },
        omit: { couponId: true, userId: true },
      });

      return order;
    });

    // If payment method is CASH, delete cart items and update cart
    if (createOrderDto.paymentMethod === "CASH") {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      await this.prisma.cart.update({
        where: { id: cart.id },
        data: { subTotal: 0, discount: 0, totalPrice: 0, couponId: null },
      });
      // Update product stock and sold quantity
      for (const item of order.orderItems) {
        await this.prisma.product.update({
          where: { id: item.product.id },
          data: {
            stock: { decrement: item.quantity },
            sold: { increment: item.quantity },
          },
        });
      }
    }

    // Update coupon used count
    if (order.coupon?.code) {
      await this.prisma.coupon.update({
        where: { id: order.coupon.id },
        data: {
          usedCount: { increment: 1 },
        },
      });
    }

    // Send order notification email
    if (createOrderDto.paymentMethod === "CASH") {
      try {
        await this.emailService.sendNewOrderEmail(order.user.email, {
          ...order,
          shippingAddress,
          orderItems: order.orderItems.map((item) => ({
            product: {
              name: item.product.title,
              image: item.product.imageCover,
            },
            price: item.price,
            quantity: item.quantity,
          })),
        });
      } catch (error) {
        console.log("Failed to send order notification email");
      }
    }

    if (createOrderDto.paymentMethod === "CREDIT_CARD") {
      const lineItems = order.orderItems.map((item) => ({
        price_data: {
          currency: "egp",
          product_data: {
            name: item.color
              ? `${item.product.title} (${item.color})`
              : item.product.title,
            images: [item.product.imageCover],
            description: item.product.description,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      lineItems.push({
        price_data: {
          currency: "egp",
          product_data: {
            name: "Shipping Cost",
            images: [
              "https://plus.unsplash.com/premium_photo-1664297836401-d0a2e3cefacf",
            ],
            description: "Shipping Cost",
          },
          unit_amount: Math.round(shippingAddress.city.shippingPrice * 100),
        },
        quantity: 1,
      });

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${cancelUrl}?session_id={CHECKOUT_SESSION_ID}&error=payment_failed&order_id=${order.id}`,
        metadata: { orderId: order.id, userId },
        customer_email: order.user.email,
        client_reference_id: order.user.id,
      });
      if (!session)
        throw new BadRequestException(
          "Failed to create Stripe checkout session",
        );

      return {
        success: true,
        message: "Stripe checkout session created successfully",
        data: {
          order,
          checkoutUrl: session.url!,
        },
      };
    }

    return {
      success: true,
      message: "Checkout successfully",
      data: order,
    };
  }

  /**
   * @Docs     User get an order
   * @Route    GET /api/v1/orders/:id
   * @Access   private [User]
   */
  async findUserOrder(
    id: string,
    userId: string,
  ): Promise<APIRes<Partial<Order>>> {
    const order = await this.prisma.order.findUnique({
      where: { id, userId },
      include: {
        coupon: true,
        orderItems: {
          include: { product: true },
          omit: { productId: true, orderId: true },
        },
      },
      omit: { couponId: true, userId: true },
    });
    if (!order) throw new NotFoundException("Order not found.");
    return {
      success: true,
      message: null,
      data: order,
    };
  }

  /**
   * @Docs     get user orders
   * @Route    GET /api/v1/orders/my-orders
   * @Access   private [ADMIN, USER]
   */
  async findAllUserOrders(
    sort: "asc" | "desc" = "desc",
    filters: FilterOrderDto,
    userId: string,
  ): Promise<APIRes<Partial<Order>[]>> {
    sort = sort === "asc" ? "asc" : "desc";
    const where = this.buildOrderWhereClause(filters, userId);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found.");

    const orders = await this.prisma.order.findMany({
      where: {
        userId,
        ...where,
      },
      orderBy: { createdAt: sort },
      include: {
        coupon: true,
        user: {
          omit: {
            password: true,
            refreshToken: true,
          },
        },
        orderItems: {
          include: { product: true },
          omit: { productId: true, orderId: true },
        },
      },
      omit: { couponId: true, userId: true },
    });
    return {
      success: true,
      message: null,
      data: orders,
    };
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
  async findAll(
    page: number,
    limit: number,
    sort: "asc" | "desc" = "desc",
    filters: FilterOrderDto,
  ): Promise<APIRes<Partial<Order>[]>> {
    return this.findOrders({ page, limit, sort, filters });
  }

  /**
   * @Docs     Admin get an order
   * @Route    GET /api/v1/orders/:id
   * @Access   private [Admin]
   */
  async findOne(id: string): Promise<APIRes<Partial<Order>>> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          omit: {
            password: true,
            refreshToken: true,
          },
        },
        coupon: true,
        orderItems: {
          include: { product: true },
          omit: { productId: true, orderId: true },
        },
      },
      omit: { couponId: true, userId: true },
    });
    if (!order) throw new NotFoundException("Order not found.");

    return {
      success: true,
      message: null,
      data: order,
    };
  }

  /**
   * @Docs     Build order where clause
   * @Access   private
   */
  private buildOrderWhereClause(filters: FilterOrderDto, userId?: string) {
    const where: any = userId ? { userId } : {};

    if (filters) {
      if (filters.status) where.status = filters.status;
      if (filters.isPaid !== undefined) where.isPaid = filters.isPaid;
      if (filters.isDelivered !== undefined)
        where.isDelivered = filters.isDelivered;
      if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;
      if (filters.paymentMethod) where.paymentMethod = filters.paymentMethod;

      // Only apply user name filter for admin endpoint
      if (!userId && filters.user) {
        where.user = { name: { contains: filters.user, mode: "insensitive" } };
      }
    }

    return where;
  }

  /**
   * @Docs     Find orders
   * @Access   private
   */
  private async findOrders({
    page = 1,
    limit = 20,
    sort = "desc",
    filters = {},
    userId,
  }: Partial<FindOrdersOptions> = {}): Promise<APIRes<Partial<Order>[]>> {
    // Validate and normalize inputs
    sort = sort === "asc" ? "asc" : "desc";
    page = Number(page) || 1;
    limit = Number(limit) || 20;
    const where = this.buildOrderWhereClause(filters, userId);

    if (userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException("User not found.");
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: sort },
        include: {
          coupon: true,
          user: userId
            ? false
            : {
                omit: {
                  password: true,
                  refreshToken: true,
                },
              },
          orderItems: {
            include: { product: true },
            omit: { productId: true, orderId: true },
          },
        },
        omit: { couponId: true, userId: true },
      }),
      this.prisma.order.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      success: true,
      message: null,
      data: {
        items,
        meta: {
          count: items.length,
          limit: limit,
          page: page,
          total,
          totalPages,
          hasPrevPage: page > 1,
          hasNextPage: page < totalPages,
        },
      },
    };
  }

  /**
   * @Docs     Admin update an order
   * @Route    PATCH /api/v1/orders/:id
   * @Access   private [Admin]
   */
  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<APIRes<Partial<Order>>> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true, coupon: true },
    });
    if (!order) throw new NotFoundException("Order not found.");

    // Cannot modify cancelled order
    if (order.status === "CANCELLED")
      throw new BadRequestException("Cannot update a cancelled order.");

    // Cannot modify completed order to pending
    if (order.status === "COMPLETED" && updateOrderDto.status === "PENDING")
      throw new BadRequestException(
        "Cannot change status from complated to pending",
      );

    const orderStatuses = {
      status: order.status,
      isDelivered: order.isDelivered,
      paymentStatus: order.paymentStatus,
      isPaid: order.isPaid,
    };

    if (updateOrderDto.isDelivered) {
      orderStatuses.isDelivered = true;
      orderStatuses.status = "COMPLETED";
      orderStatuses.paymentStatus = "PAID";
      orderStatuses.isPaid = true;
    }

    if (updateOrderDto.status === "COMPLETED") {
      orderStatuses.status = "COMPLETED";
      orderStatuses.paymentStatus = "PAID";
      orderStatuses.isPaid = true;
      orderStatuses.isDelivered = true;
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        ...orderStatuses,

        deliveredAt:
          (orderStatuses.isDelivered || order.isDelivered) && !order.deliveredAt
            ? new Date()
            : order.deliveredAt || null,
      },
      include: {
        user: true,
        coupon: true,
        orderItems: {
          include: { product: true },
          omit: { productId: true, orderId: true },
        },
      },
      omit: { couponId: true, userId: true },
    });

    /**
     * * Auto update product stock and sold quantity if order is cancelled and payment method is CASH
     * * Payment method Credit Card is handled by Stripe Webhook if failed to pay
     */
    if (order.paymentMethod === "CASH") {
      // Rollback product stock and sold quantity
      if (status === "CANCELLED") {
        for (const item of order.orderItems) {
          await this.prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
              sold: { decrement: item.quantity },
            },
          });
        }
      }

      // Rollback coupon usage
      if (order.coupon) {
        await this.prisma.coupon.update({
          where: { id: order.coupon.id },
          data: {
            usedCount: { decrement: 1 },
          },
        });
      }
    }

    // Parse the shipping address
    const shippingAddress =
      updatedOrder.shippingAddress as unknown as IShippingAddress;

    // Send order update notification email
    try {
      await this.emailService.sendOrderUpdateEmail(
        updatedOrder.user.email,
        {
          ...updatedOrder,
          shippingAddress,
          orderItems: updatedOrder.orderItems.map((item) => ({
            product: {
              name: item.product.title,
              image: item.product.imageCover,
            },
            price: item.price,
            quantity: item.quantity,
          })),
        },
        updateOrderDto,
      );
    } catch (error) {
      console.log("Failed to send order update notification email");
    }

    return {
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    };
  }

  /**
   * @Docs     Generate order number
   */
  private generateOrderNumber(userId: string | number, uuid: string) {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    const shortUUID = uuid.replace(/-/g, "").slice(0, 8).toUpperCase();

    return `ORD-${y}${m}${day}-${userId}-${shortUUID}`;
  }
}
