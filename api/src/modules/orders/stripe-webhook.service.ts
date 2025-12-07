import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Order } from "@prisma/client";
import Stripe from "stripe";
import { IShippingAddress } from "./interfaces/shipping-address.interface";
import { EmailService, IOrderNotification } from "../../email/email.service";

export interface CreateOrderRes {
  order: Partial<Order>;
  checkoutUrl?: string;
}

@Injectable()
export class StripeWebhookService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  /**
   * @Docs     Verify paid credit card
   */
  async verifyPaidCreditCard(event: Stripe.Event) {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId;
      if (orderId) {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
        await this.prisma.$transaction([
          this.prisma.cartItem.deleteMany({
            where: { cartId: cart?.id },
          }),
          this.prisma.cart.update({
            where: { id: cart?.id },
            data: { subTotal: 0, discount: 0, totalPrice: 0, couponId: null },
          }),
          this.prisma.order.update({
            where: { id: orderId },
            data: {
              isPaid: true,
              paymentStatus: "PAID",
            },
          }),
        ]);

        // Update product stock and sold quantity
        const order = await this.prisma.order.findUnique({
          where: { id: orderId },
          include: { orderItems: { include: { product: true } } },
        });
        if (!order) {
          throw new NotFoundException("Order not found");
        }
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
    }
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: { include: { product: true } },
        coupon: true,
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    const shippingAddress =
      order.shippingAddress as unknown as IShippingAddress;

    // Send order notification email

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

    return {
      success: true,
      message: "Payment verified successfully",
    };
  }

  /**
   * @Docs     Handle failed payment
   */
  async handleFailedPayment(orderId: string) {
    // Get the order with all its items before deleting
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true, coupon: true },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (order.coupon) {
      await this.prisma.coupon.update({
        where: { id: order.coupon.id },
        data: {
          usedCount: { decrement: 1 },
        },
      });
    }

    // Restore product quantities
    for (const item of order.orderItems) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { increment: item.quantity },
          sold: { decrement: item.quantity },
        },
      });
    }

    // Finally, update the order to cancel it
    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        isPaid: false,
        paymentStatus: "FAILED",
        status: "CANCELLED",
        isDelivered: false,
        deliveredAt: null,
      },
    });
  }
}
