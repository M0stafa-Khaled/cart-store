import { Controller, Post, Headers, Body } from "@nestjs/common";
import Stripe from "stripe";
import { StripeWebhookService } from "./stripe-webhook.service";

@Controller("v1/webhooks")
export class StripeWebhookController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
  });

  constructor(private stripeWebhookService: StripeWebhookService) {}

  /**
   * @Docs     Handle stripe webhook to verify paid credit card and handle failed payment
   * @Route    POST /api/v1/webhooks/stripe
   * @Access   private [stripe]
   */
  @Post("stripe")
  async handleWebhook(
    @Body() body: any,
    @Headers("stripe-signature") signature: string,
  ) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      return {
        success: false,
        message: `Invalid Stripe signature.`,
      };
    }

    try {
      // Handle successful payment
      if (event.type === "checkout.session.completed") {
        return this.stripeWebhookService.verifyPaidCreditCard(event);
      }

      // Handle failed payment
      if (event.type === "checkout.session.async_payment_failed") {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await this.stripeWebhookService.handleFailedPayment(orderId);
        }

        return {
          success: false,
          message: "Payment failed. Order has been cancelled.",
        };
      }

      return {
        success: true,
        message: "Webhook received but no action taken.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Error processing webhook",
      };
    }
  }
}
